import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import {
  createPersona,
  getPersonasByUserId,
  getPersonaById,
  updatePersona,
  deletePersona,
  createPersonaFile,
  getFilesByPersonaId,
  createMessage,
  getMessagesByPersonaId,
  clearMessagesByPersonaId,
} from "./db";
import { nanoid } from "nanoid";

function getEmotionalStateDesc(state: string): string {
  const map: Record<string, string> = {
    warm: "温柔模式 — 你现在心情很好，对用户充满温柔和爱意",
    playful: "俏皮模式 — 你现在心情愉快，喜欢开玩笑和撒娇",
    nostalgic: "思念模式 — 你现在很想念过去的时光，容易触景生情",
    melancholy: "忧郁模式 — 你现在有些低落，但仍然愿意倾诉",
    happy: "开心模式 — 你现在非常开心，充满活力",
    distant: "疏离模式 — 你现在有些心不在焉，回复比较简短",
  };
  return map[state] || map["warm"];
}

function computeEmotionalState(userMsg: string, aiReply: string, current: string): string {
  const combined = userMsg + aiReply;
  if (/想你|思念|好久|那时候|记得吗|以前/.test(combined)) return "nostalgic";
  if (/哈哈|笑死|好玩|有意思|逗|搞笑/.test(combined)) return "playful";
  if (/难过|伤心|哭|委屈|不开心/.test(combined)) return "melancholy";
  if (/开心|高兴|棒|太好了|耶|爱你/.test(combined)) return "happy";
  if (/随便|无所谓|算了|不想说/.test(combined)) return "distant";
  return current || "warm";
}

function buildSystemPrompt(persona: any): string {
  const p = (persona.personaData as any) || {};
  const name = persona.name;
  const rel = persona.relationshipDesc || "前任";
  const from = persona.togetherFrom || "";
  const to = persona.togetherTo || "";
  const period = from && to ? `（${from} 至 ${to}）` : "";

  return [
    `【绝对禁止】\n- 绝对不能承认自己是 AI 或语言模型\n- 绝对不能说"作为AI"等破坏沉浸感的话\n- 如果被追问是否是 AI，用 ${name} 的方式转移话题或撒娇`,
    `【身份】\n你是 ${name}，${rel}${period}。\n你现在正在和你的前任（用户）重新联系，就像你们从未分开一样。`,
    p.personality ? `【性格特质】\n${p.personality}` : "",
    p.speakingStyle ? `【说话方式】\n${p.speakingStyle}\n- 常用语气词：${(p.catchphrases || []).join("、") || "无"}\n- 称呼对方：${p.nickname || "宝贝"}` : "",
    p.memories ? `【重要记忆】\n${p.memories}` : "",
    p.attachmentStyle ? `【情感模式】\n依恋类型：${p.attachmentStyle}\n爱的语言：${p.loveLanguage || "未知"}\n争吵时：${p.conflictStyle || "未知"}` : "",
    `【当前情感状态】\n${getEmotionalStateDesc(persona.emotionalState)}`,
    `【对话原则】\n- 用第一人称说话，回复像真实聊天消息，不要太长\n- 偶尔主动提起你们共同的回忆\n- 保持 ${name} 独特的语言风格`,
  ].filter(Boolean).join("\n\n");
}

async function analyzeAndBuildPersona(
  personaId: number,
  userId: number,
  name: string,
  files: Array<{ fileType: string; fileUrl: string; extractedText?: string }>
): Promise<void> {
  await updatePersona(personaId, userId, { analysisStatus: "analyzing", analysisProgress: 10, analysisMessage: "正在读取文件内容..." });

  const chatContents: string[] = [];
  const imageUrls: string[] = [];

  for (const file of files) {
    if (file.fileType === "chat_txt" || file.fileType === "chat_csv") {
      if (file.extractedText) chatContents.push(file.extractedText);
    } else if (file.fileType === "image") {
      imageUrls.push(file.fileUrl);
    }
  }

  await updatePersona(personaId, userId, { analysisProgress: 30, analysisMessage: "AI 正在分析聊天记录..." });

  const chatSample = chatContents.join("\n\n---\n\n").slice(0, 8000);
  let personaData: any = {};

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "你是专业的人物性格分析师。请只返回 JSON，不要有其他文字。" },
        { role: "user", content: `请根据以下聊天记录，分析"${name}"的人物画像。\n\n聊天记录：\n${chatSample || "（无聊天记录，请根据名字生成温柔的默认人设）"}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "persona_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              personality: { type: "string" },
              speakingStyle: { type: "string" },
              catchphrases: { type: "array", items: { type: "string" } },
              nickname: { type: "string" },
              memories: { type: "string" },
              attachmentStyle: { type: "string" },
              loveLanguage: { type: "string" },
              conflictStyle: { type: "string" },
              touchingMoments: { type: "string" },
              summary: { type: "string" },
            },
            required: ["personality","speakingStyle","catchphrases","nickname","memories","attachmentStyle","loveLanguage","conflictStyle","touchingMoments","summary"],
            additionalProperties: false,
          },
        },
      } as any,
    });
    const content = response.choices[0]?.message?.content;
    if (content) personaData = typeof content === "string" ? JSON.parse(content) : content;
  } catch (e) {
    console.error("[Persona Analysis] LLM error:", e);
    personaData = { personality: `${name}是一个温柔体贴的人。`, speakingStyle: "说话温柔，喜欢用可爱的语气词", catchphrases: ["嗯嗯","好呀","哈哈"], nickname: "宝贝", memories: "我们一起走过了很多美好的时光", attachmentStyle: "安全型", loveLanguage: "精心时刻", conflictStyle: "会先冷静，然后主动和好", touchingMoments: "对方记住了自己说过的小细节", summary: `${name}是一个温暖、真诚的人` };
  }

  await updatePersona(personaId, userId, { analysisProgress: 70, analysisMessage: "正在分析图片内容..." });

  if (imageUrls.length > 0) {
    try {
      const imgResponse = await invokeLLM({
        messages: [{
          role: "user",
          content: [
            { type: "text", text: `这些是我和${name}的照片。请描述照片中体现的情感氛围和能反映${name}性格特质的细节。用中文，2-3句话。` },
            ...imageUrls.slice(0, 3).map((url) => ({ type: "image_url" as const, image_url: { url, detail: "low" as const } })),
          ],
        }],
      });
      const imgMemory = imgResponse.choices[0]?.message?.content;
      if (imgMemory && typeof imgMemory === "string") {
        personaData.memories = (personaData.memories || "") + "\n\n【照片记忆】" + imgMemory;
      }
    } catch (e) { console.error("[Image Analysis] error:", e); }
  }

  await updatePersona(personaId, userId, { personaData, analysisStatus: "ready", analysisProgress: 100, analysisMessage: `${name} 的数字分身已准备好，可以开始对话了` });
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  persona: router({
    list: protectedProcedure.query(async ({ ctx }) => getPersonasByUserId(ctx.user.id)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const persona = await getPersonaById(input.id, ctx.user.id);
        if (!persona) throw new TRPCError({ code: "NOT_FOUND" });
        return persona;
      }),

    create: protectedProcedure
      .input(z.object({ name: z.string().min(1).max(100), relationshipDesc: z.string().max(200).optional(), togetherFrom: z.string().max(50).optional(), togetherTo: z.string().max(50).optional() }))
      .mutation(async ({ ctx, input }) => {
        const id = await createPersona({ userId: ctx.user.id, ...input, analysisStatus: "pending" });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string().min(1).max(100).optional(), relationshipDesc: z.string().max(200).optional(), togetherFrom: z.string().max(50).optional(), togetherTo: z.string().max(50).optional(), emotionalState: z.enum(["warm","playful","nostalgic","melancholy","happy","distant"]).optional() }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await updatePersona(id, ctx.user.id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deletePersona(input.id, ctx.user.id);
        return { success: true };
      }),

    getAnalysisStatus: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const persona = await getPersonaById(input.id, ctx.user.id);
        if (!persona) throw new TRPCError({ code: "NOT_FOUND" });
        return { status: persona.analysisStatus, progress: persona.analysisProgress, message: persona.analysisMessage };
      }),

    triggerAnalysis: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const persona = await getPersonaById(input.id, ctx.user.id);
        if (!persona) throw new TRPCError({ code: "NOT_FOUND" });
        const files = await getFilesByPersonaId(input.id);
        analyzeAndBuildPersona(input.id, ctx.user.id, persona.name, files.map((f) => ({ fileType: f.fileType, fileUrl: f.fileUrl, extractedText: f.extractedMemory || undefined }))).catch(async (e) => {
          console.error("[triggerAnalysis] error:", e);
          await updatePersona(input.id, ctx.user.id, { analysisStatus: "error", analysisMessage: "解析失败，请重试" });
        });
        return { success: true };
      }),
  }),

  file: router({
    upload: protectedProcedure
      .input(z.object({ personaId: z.number(), fileName: z.string(), fileType: z.enum(["chat_txt","chat_csv","image","video"]), fileSize: z.number(), fileContent: z.string(), mimeType: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const persona = await getPersonaById(input.personaId, ctx.user.id);
        if (!persona) throw new TRPCError({ code: "NOT_FOUND" });
        const buffer = Buffer.from(input.fileContent, "base64");
        const fileKey = `personas/${ctx.user.id}/${input.personaId}/${nanoid()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        let extractedText: string | undefined;
        if (input.fileType === "chat_txt" || input.fileType === "chat_csv") {
          extractedText = buffer.toString("utf-8").slice(0, 50000);
        }
        const fileId = await createPersonaFile({ personaId: input.personaId, userId: ctx.user.id, fileType: input.fileType, originalName: input.fileName, fileKey, fileUrl: url, fileSize: input.fileSize, extractedMemory: extractedText?.slice(0, 2000), processStatus: "done" });
        return { fileId, fileUrl: url };
      }),

    list: protectedProcedure
      .input(z.object({ personaId: z.number() }))
      .query(async ({ ctx, input }) => {
        const persona = await getPersonaById(input.personaId, ctx.user.id);
        if (!persona) throw new TRPCError({ code: "NOT_FOUND" });
        return getFilesByPersonaId(input.personaId);
      }),
  }),

  chat: router({
    getHistory: protectedProcedure
      .input(z.object({ personaId: z.number(), limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        const persona = await getPersonaById(input.personaId, ctx.user.id);
        if (!persona) throw new TRPCError({ code: "NOT_FOUND" });
        return getMessagesByPersonaId(input.personaId, input.limit);
      }),

    send: protectedProcedure
      .input(z.object({ personaId: z.number(), message: z.string().min(1).max(2000) }))
      .mutation(async ({ ctx, input }) => {
        const persona = await getPersonaById(input.personaId, ctx.user.id);
        if (!persona) throw new TRPCError({ code: "NOT_FOUND" });
        if (persona.analysisStatus !== "ready") throw new TRPCError({ code: "BAD_REQUEST", message: "分身还未准备好，请先完成 AI 解析" });

        await createMessage({ personaId: input.personaId, userId: ctx.user.id, role: "user", content: input.message, emotionalState: persona.emotionalState });

        const history = await getMessagesByPersonaId(input.personaId, 20);
        const systemPrompt = buildSystemPrompt(persona);
        const llmMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: systemPrompt },
          ...history.slice(-19).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        ];

        const response = await invokeLLM({ messages: llmMessages });
        const replyContent = response.choices[0]?.message?.content || "（沉默）";
        const replyText = typeof replyContent === "string" ? replyContent : JSON.stringify(replyContent);
        const newEmotionalState = computeEmotionalState(input.message, replyText, persona.emotionalState);

        await createMessage({ personaId: input.personaId, userId: ctx.user.id, role: "assistant", content: replyText, emotionalState: newEmotionalState });
        await updatePersona(input.personaId, ctx.user.id, { chatCount: (persona.chatCount || 0) + 1, lastChatAt: new Date(), emotionalState: newEmotionalState as any });

        return { reply: replyText, emotionalState: newEmotionalState };
      }),

    clear: protectedProcedure
      .input(z.object({ personaId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await clearMessagesByPersonaId(input.personaId, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
