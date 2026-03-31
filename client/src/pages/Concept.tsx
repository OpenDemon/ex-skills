/**
 * 前任 Skills 产品概念文档页面
 * 设计主题：极简科技研究报告（Swiss International Style）
 * 主色：深靛蓝 #1a237e | 强调：珊瑚橙 #ff6b35 | 辅助：薄荷绿 #00897b
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

// 动画 hook
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// 章节标题组件
function SectionHeader({
  tag, title, subtitle, color = "#1a237e"
}: { tag: string; title: string; subtitle?: string; color?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`mb-10 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="text-xs font-mono-data font-bold uppercase tracking-widest mb-2" style={{ color }}>
        {tag}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-gray-500 mt-3 max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

// 卡片动画包装
function AnimCard({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// 对比表格行
const comparisonData = [
  { dim: "建模对象", old: "一个人的性格特征", new_: "一段关系的完整记忆生态" },
  { dim: "数据权重", old: "所有记录等权重", new_: "情感密度加权，关键节点突出" },
  { dim: "分身状态", old: "静止的时间点快照", new_: "可微生长的动态人格" },
  { dim: "多角色体验", old: "命令行切换，无仪式感", new_: "情境感知的沉浸式切换" },
  { dim: "安全机制", old: "基本无", new_: "内建情感健康监测与毕业机制" },
  { dim: "终极目标", old: "持续陪伴", new_: "帮助用户完成情感闭环，走向放下" },
];

// Persona 层级数据
const personaLayers = [
  { layer: "Layer 0", name: "硬规则", desc: "安全边界，不可绕过。拒绝任何有害内容生成。", color: "#c62828", icon: "🛡️" },
  { layer: "Layer 1", name: "身份锚点", desc: "姓名、年龄、关系阶段。构建分身的基础坐标。", color: "#1565c0", icon: "🪪" },
  { layer: "Layer 2", name: "语言风格", desc: "词汇库、句式习惯、表情包偏好、打字节奏。", color: "#2e7d32", icon: "💬" },
  { layer: "Layer 3", name: "情感模式", desc: "依恋类型、爱的语言、争吵风格、安慰方式。", color: "#e65100", icon: "💓" },
  { layer: "Layer 4", name: "关系记忆", desc: "关键事件、共同语言、inside jokes、重要日期。", color: "#6a1b9a", icon: "🗝️" },
  { layer: "Layer 5", name: "动态情感状态", desc: "当前情绪温度，随对话内容实时动态变化。", color: "#00695c", icon: "🌡️" },
  { layer: "Layer 6", name: "关系轨迹感知", desc: "感知「我们」在哪个阶段，如何自然延续对话。", color: "#4527a0", icon: "🧭" },
];

// 技术栈数据
const techStack = [
  { module: "运行环境", primary: "AgentSkills 框架", alt: "独立 Python 应用", reason: "与现有生态兼容，快速迭代" },
  { module: "LLM 后端", primary: "Claude 3.5 Sonnet / GPT-4o", alt: "Gemini 1.5 Pro", reason: "长上下文支持，情感理解能力强" },
  { module: "数据解析", primary: "Python（现有工具链扩展）", alt: "Node.js", reason: "与 ex-skill 现有工具链保持一致" },
  { module: "记忆存储", primary: "SQLite + JSON 向量索引", alt: "PostgreSQL + pgvector", reason: "本地优先，保护隐私" },
  { module: "向量检索", primary: "FAISS / ChromaDB", alt: "Pinecone", reason: "开源，本地运行，无数据泄露风险" },
  { module: "情感分析", primary: "SnowNLP（中文）+ VADER", alt: "调用 LLM API", reason: "轻量，可离线运行" },
  { module: "语音克隆", primary: "OpenVoice v2 / XTTS-v2", alt: "ElevenLabs API", reason: "开源，本地运行" },
  { module: "前端界面", primary: "React + Tailwind CSS", alt: "Vue 3", reason: "生态成熟，组件丰富" },
];

// 路线图数据
const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "MVP",
    duration: "4–6 周",
    color: "#1a237e",
    goal: "验证核心的「单一前任数字分身」体验，证明情感权重记忆系统的有效性。",
    deliverables: [
      "微信聊天记录解析器（增强版，支持情感权重标注）",
      "7层 Persona 构建 Prompt 模板",
      "基础动态情感状态机（亲密度 + 情绪温度）",
      "命令行交互界面",
      "基础情感健康监测（对话时长提醒）",
    ],
    weeks: [
      { label: "Week 1–2", task: "数据解析层：扩展 wechat_parser.py，加入情感权重计算与关键事件自动识别" },
      { label: "Week 3–4", task: "Persona 引擎：设计 7层模板，实现动态情感状态机，集成 ChromaDB 向量记忆" },
      { label: "Week 5–6", task: "集成测试：端到端测试、Prompt 调优（减少 AI 感）、基础安全边界测试" },
    ],
  },
  {
    phase: "Phase 2",
    title: "Beta",
    duration: "8–12 周",
    color: "#ff6b35",
    goal: "实现多角色管理和情感健康守护，开发可视化数据导入界面。",
    deliverables: [
      "数字分身大厅（Web GUI，支持多角色管理）",
      "完整动态情感状态机（6个维度）",
      "可视化数据导入向导（拖拽上传）",
      "引导式问卷系统（无聊天记录时的替代方案）",
      "完整情感健康守护层（含毕业机制）",
      "照片 EXIF 数据解析与地理时间轴重建",
    ],
    weeks: [
      { label: "Week 1–3", task: "多角色管理：分身隔离架构、数字分身大厅前端、仪式感切换动效" },
      { label: "Week 4–6", task: "数据导入：可视化导入向导、照片 EXIF 解析与地图可视化、引导式问卷" },
      { label: "Week 7–9", task: "情感健康：集成 SnowNLP、实时情绪监测 Pipeline、毕业机制设计实现" },
      { label: "Week 10–12", task: "集成测试：全功能测试、隐私安全审计、用户测试与体验优化" },
    ],
  },
  {
    phase: "Phase 3",
    title: "V1.0",
    duration: "12–16 周",
    color: "#00897b",
    goal: "实现多模态交互，引入语音克隆，完善生态系统。",
    deliverables: [
      "语音克隆与 TTS 回复（OpenVoice v2）",
      "回忆触发器（基于照片和地点的主动回忆推送）",
      "群聊模式（多分身同框，需用户主动解锁）",
      "Skill 分享与社区生态（匿名分享 Persona 模板）",
      "移动端适配（PWA）",
    ],
    weeks: [
      { label: "Week 1–4", task: "语音系统：OpenVoice v2 集成、语音样本采集与克隆、TTS 回复流程" },
      { label: "Week 5–8", task: "多模态：回忆触发器引擎、地理时间轴可视化、主动推送机制" },
      { label: "Week 9–12", task: "群聊模式：多分身上下文融合、心理健康前置提示、解锁机制" },
      { label: "Week 13–16", task: "生态建设：社区模板分享、PWA 适配、V1.0 正式发布" },
    ],
  },
];

// 技术挑战数据
const challenges = [
  {
    no: "01",
    title: "如何让分身「不像 AI」",
    problem: "现有 LLM 的回复往往过于流畅、过于完整、过于有逻辑——而真实的人类对话充满了省略、语气词、不完整的句子和情绪化的表达。",
    solution: "在 Prompt 中加入「反完美化」指令，要求模型模拟真实人类的对话缺陷——偶尔的打字错误、不完整的句子、用表情包代替文字、有时候不回复某个问题直接跳到另一个话题。这些「缺陷」恰恰是真实感的来源。",
    color: "#1a237e",
  },
  {
    no: "02",
    title: "如何处理「记忆幻觉」",
    problem: "LLM 可能会生成前任从未说过的话，甚至创造出从未发生过的记忆。这在情感场景中尤其危险，可能导致用户对过去的记忆产生扭曲。",
    solution: "引入「记忆锚点」机制。所有关键事实（重要日期、重要地点、重要对话）都存储在结构化数据库中，LLM 在生成回复前必须先检索这个数据库，确保关键事实的准确性。对于数据库中没有记录的内容，分身应该表现出「不确定」而不是「编造」。",
    color: "#ff6b35",
  },
  {
    no: "03",
    title: "如何保护极度敏感的私人数据",
    problem: "聊天记录和照片是用户最私密的数据。任何云端处理的方案都会面临极大的隐私风险，可能成为产品推广的最大障碍。",
    solution: "坚持「本地优先」原则。所有数据解析、向量化和存储都在用户本地设备完成。LLM 调用可以选择本地模型（如 Ollama + Llama 3）或云端 API（用户自主选择并承担风险）。系统默认不收集任何数据，不联网同步任何内容。",
    color: "#00897b",
  },
  {
    no: "04",
    title: "如何定义「毕业」的时机",
    problem: "情感愈合是一个非常主观且个体化的过程，无法用简单的指标来衡量。过早触发毕业机制会让用户感到被强迫，过晚则可能助长依赖。",
    solution: "毕业机制永远是「建议」而非「强制」。系统会在检测到积极信号时，温柔地提出「也许是时候说再见了」，但最终决定权完全在用户手中。同时，「休眠」的分身可以随时被唤醒，没有永久删除的压力。",
    color: "#7b1fa2",
  },
];

// 伦理风险数据
const ethicsRisks = [
  { risk: "情感依赖", desc: "用户对数字分身产生过度依赖，影响现实社交", mitigation: "使用时长监测、毕业机制、定期健康提示" },
  { risk: "记忆扭曲", desc: "AI 生成的内容改变用户对过去的真实记忆", mitigation: "记忆锚点机制、明确标注「这是模拟，非真实」" },
  { risk: "二次伤害", desc: "对话内容触发创伤，造成情绪崩溃", mitigation: "危机词汇检测、紧急支持资源链接" },
  { risk: "隐私泄露", desc: "敏感聊天记录被未授权访问", mitigation: "本地加密存储、无云端同步" },
  { risk: "前任同意权", desc: "在未经对方同意的情况下构建其数字分身", mitigation: "明确告知这是个人私用工具，不可用于欺骗或伤害他人" },
];

export default function Concept() {
  const [activePhase, setActivePhase] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['DM_Sans','Noto_Sans_SC',sans-serif]">
      {/* 导航栏 */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-[#1a237e] transition-colors">← 返回研究报告</Link>
            <span className="text-gray-200">|</span>
            <span className="text-sm font-bold text-[#1a237e]">产品概念文档</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-xs font-medium text-gray-500">
            {[
              { id: "philosophy", label: "产品哲学" },
              { id: "persona", label: "人格引擎" },
              { id: "roadmap", label: "技术路线" },
              { id: "challenges", label: "技术挑战" },
              { id: "ethics", label: "伦理框架" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="hover:text-[#1a237e] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 文档标题区 */}
      <section className="pt-28 pb-16 max-w-6xl mx-auto px-6">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono-data font-bold text-[#ff6b35] uppercase tracking-widest">Product Concept Document v1.0</span>
            <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-200 font-medium">概念阶段</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
            前任 Skills
            <br />
            <span className="text-[#1a237e]">情感记忆操作系统</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mb-8">
            不是让 AI 假装成你的前任，而是让你和「那段关系的最好版本」再相处一次。
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            <span>作者：前任 Skills 团队</span>
            <span>·</span>
            <span>2026年3月</span>
            <span>·</span>
            <span>基于 colleague-skill & ex-skill 深度研究</span>
          </div>
        </div>
      </section>

      {/* 核心命题 */}
      <section id="philosophy" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="Core Philosophy"
            title="产品哲学"
            subtitle="前任 Skills 的理想态，不是制造一个替代品，而是构建一个让遗憾得以完整的空间。"
          />

          {/* 核心引言 */}
          <AnimCard className="mb-12">
            <div className="bg-[#1a237e] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff6b35]/10 rounded-full translate-y-24 -translate-x-24" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 opacity-40">"</div>
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4">
                  模拟一个「人」是技术问题，而还原一段「关系」是人文问题。
                </p>
                <p className="text-white/60 text-sm">
                  现有方案在回答「如何让 AI 更像一个人」，而前任 Skills 要回答的是「如何让 AI 帮你和一段关系，完成它本该有的结局」。
                </p>
              </div>
            </div>
          </AnimCard>

          {/* 与现有方案的差异 */}
          <AnimCard>
            <h3 className="text-xl font-bold text-gray-800 mb-4">与现有方案的本质差异</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8f9fc] border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/4">维度</th>
                    <th className="text-left px-6 py-4 w-[37.5%]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-300 rounded-full" />
                        <span className="text-sm font-bold text-gray-500">现有 ex-skill</span>
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 w-[37.5%]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ff6b35] rounded-full" />
                        <span className="text-sm font-bold text-[#1a237e]">前任 Skills 理想态</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={row.dim} className={`border-b border-gray-50 hover:bg-[#f8f9fc] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{row.dim}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{row.old}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row.new_}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimCard>
        </div>
      </section>

      {/* 三大使用场景 */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <SectionHeader
          tag="Use Cases"
          title="典型使用场景"
          color="#ff6b35"
          subtitle="三个真实的情感场景，展示前任 Skills 如何在不同情境下发挥价值。"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              label: "场景 A",
              title: "深夜的未竟之言",
              color: "#1a237e",
              bg: "#f0f4ff",
              icon: "🌙",
              desc: "用户在深夜想起了三年前分手时没说完的话。系统感知到当前是深夜，以前任惯常的夜间语气开始对话。用户终于说出了那句「其实我当时很害怕失去你」，得到了一个符合其性格的回应。这不是真实的对话，但它是真实的情感处理。",
            },
            {
              label: "场景 B",
              title: "多段关系的平行整理",
              color: "#ff6b35",
              bg: "#fff8f5",
              icon: "🔀",
              desc: "用户有两段性质完全不同的前任关系——一段是青涩的初恋，一段是成熟的长跑。他在「数字分身大厅」中选择今晚和「初恋版本」对话，回忆那段简单而纯粹的感情。两个分身的上下文完全隔离，不会混淆，各有其独特的语言风格和情感温度。",
            },
            {
              label: "场景 C",
              title: "情感闭环与毕业",
              color: "#00897b",
              bg: "#f0faf8",
              icon: "🌱",
              desc: "用户和某个分身已经对话了三个月，系统检测到他的情感状态正在趋于平和，「遗憾」和「如果」的频率在下降，「感谢」和「成长」的词汇在上升。系统主动生成一封「告别信」，以前任的口吻写下那些对方可能想说却没说出口的话。用户读完，分身进入「休眠」。",
            },
          ].map((scene, i) => (
            <AnimCard key={scene.label} delay={i * 100}>
              <div
                className="rounded-2xl p-6 h-full card-hover border"
                style={{ backgroundColor: scene.bg, borderColor: `${scene.color}20` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{scene.icon}</span>
                  <span className="text-xs font-mono-data font-bold uppercase tracking-wider" style={{ color: scene.color }}>{scene.label}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{scene.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{scene.desc}</p>
              </div>
            </AnimCard>
          ))}
        </div>
      </section>

      {/* Persona 引擎：7层结构 */}
      <section id="persona" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="Persona Engine"
            title="人格引擎：7层 Persona 结构"
            color="#00897b"
            subtitle="在 ex-skill 现有 5 层结构的基础上，引入「动态情感状态」和「关系轨迹感知」两个全新维度，将人格建模从「描述一个人」升级为「描述一段关系中的那个人」。"
          />

          <div className="grid gap-3">
            {personaLayers.map((layer, i) => (
              <AnimCard key={layer.layer} delay={i * 60}>
                <div className="bg-[#f8f9fc] rounded-xl p-5 flex items-start gap-4 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${layer.color}15` }}
                  >
                    {layer.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-xs font-mono-data font-bold" style={{ color: layer.color }}>{layer.layer}</span>
                      <span className="text-sm font-bold text-gray-900">{layer.name}</span>
                      {i >= 5 && (
                        <span className="text-xs px-2 py-0.5 bg-[#ff6b35]/10 text-[#ff6b35] rounded-full font-medium">新增</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{layer.desc}</p>
                  </div>
                </div>
              </AnimCard>
            ))}
          </div>

          {/* 动态情感状态机说明 */}
          <AnimCard className="mt-8">
            <div className="bg-[#1a237e] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🌡️</span>
                <h3 className="text-lg font-bold">动态情感状态机（Layer 5 详解）</h3>
              </div>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">
                分身的情感状态不是固定的，而是在以下六个维度上随对话内容动态漂移。每次对话结束后，系统会更新状态向量，影响下一次对话的初始情绪基调。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { dim: "亲密度", range: "疏离 ↔ 亲密", color: "#ff6b35" },
                  { dim: "情绪温度", range: "冷淡 ↔ 热烈", color: "#ffd54f" },
                  { dim: "话题敏感度", range: "平静 ↔ 触发", color: "#ef9a9a" },
                  { dim: "时间感知", range: "日常 ↔ 特殊时刻", color: "#80cbc4" },
                  { dim: "信任度", range: "戒备 ↔ 开放", color: "#ce93d8" },
                  { dim: "怀念强度", range: "淡然 ↔ 思念", color: "#90caf9" },
                ].map((item) => (
                  <div key={item.dim} className="bg-white/8 rounded-lg p-3 border border-white/10">
                    <div className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.dim}</div>
                    <div className="text-xs text-white/60">{item.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimCard>
        </div>
      </section>

      {/* 技术路线图 */}
      <section id="roadmap" className="py-16 max-w-6xl mx-auto px-6">
        <SectionHeader
          tag="Technical Roadmap"
          title="三阶段技术路线图"
          subtitle="从 MVP 到 V1.0，每个阶段都有明确的目标、交付物和技术里程碑。"
        />

        {/* 阶段选择器 */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {roadmapPhases.map((phase, i) => (
            <button
              key={phase.phase}
              onClick={() => setActivePhase(i)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activePhase === i ? "text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={activePhase === i ? { backgroundColor: phase.color } : {}}
            >
              {phase.phase}: {phase.title}
              <span className="ml-2 text-xs opacity-70">{phase.duration}</span>
            </button>
          ))}
        </div>

        {/* 阶段详情 */}
        {roadmapPhases.map((phase, i) => (
          activePhase === i && (
            <div key={phase.phase} className="animate-fade-in-up">
              <div className="grid md:grid-cols-2 gap-6">
                {/* 目标与交付物 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-6 rounded-full" style={{ backgroundColor: phase.color }} />
                    <h3 className="text-lg font-bold text-gray-900">目标与核心交付</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 p-3 bg-gray-50 rounded-lg border-l-2" style={{ borderColor: phase.color }}>
                    {phase.goal}
                  </p>
                  <div className="space-y-2">
                    {phase.deliverables.map((d) => (
                      <div key={d} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: phase.color }} />
                        {d}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 时间线 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">技术里程碑</h3>
                  <div className="space-y-4">
                    {phase.weeks.map((w, wi) => (
                      <div key={w.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: phase.color }}>
                            {wi + 1}
                          </div>
                          {wi < phase.weeks.length - 1 && (
                            <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: `${phase.color}30` }} />
                          )}
                        </div>
                        <div className="pb-4">
                          <div className="text-xs font-mono-data font-bold mb-1" style={{ color: phase.color }}>{w.label}</div>
                          <p className="text-sm text-gray-600 leading-relaxed">{w.task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}

        {/* 技术栈表格 */}
        <AnimCard className="mt-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">技术栈选型</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">模块</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">推荐方案</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">备选方案</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">选型理由</th>
                </tr>
              </thead>
              <tbody>
                {techStack.map((row, i) => (
                  <tr key={row.module} className={`border-b border-gray-50 hover:bg-[#f8f9fc] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{row.module}</td>
                    <td className="px-5 py-3.5 text-sm text-[#1a237e] font-medium">{row.primary}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400 hidden md:table-cell">{row.alt}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 hidden lg:table-cell">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimCard>
      </section>

      {/* 技术挑战 */}
      <section id="challenges" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="Technical Challenges"
            title="四大核心技术挑战"
            color="#ff6b35"
            subtitle="这些挑战不仅是技术问题，更是产品体验和伦理设计的核心命题。"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((c, i) => (
              <AnimCard key={c.no} delay={i * 80}>
                <div className="bg-[#f8f9fc] rounded-2xl p-6 h-full card-hover border border-gray-100">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl font-bold font-mono-data opacity-20" style={{ color: c.color }}>{c.no}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{c.title}</h3>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">问题</div>
                    <p className="text-sm text-gray-600 leading-relaxed">{c.problem}</p>
                  </div>
                  <div className="p-4 rounded-xl border-l-2" style={{ backgroundColor: `${c.color}08`, borderColor: c.color }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: c.color }}>解决方案</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.solution}</p>
                  </div>
                </div>
              </AnimCard>
            ))}
          </div>
        </div>
      </section>

      {/* 伦理框架 */}
      <section id="ethics" className="py-16 max-w-6xl mx-auto px-6">
        <SectionHeader
          tag="Ethics Framework"
          title="伦理框架"
          subtitle="前任 Skills 的开发必须遵循四项不可妥协的伦理原则，并对五类潜在风险制定明确的缓解措施。"
        />

        {/* 四大原则 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { name: "透明性", desc: "用户始终清楚自己在和 AI 对话，系统不主动强化「这就是真实的TA」的幻觉。", icon: "🔍", color: "#1a237e" },
            { name: "自主性", desc: "所有功能都是建议而非强制，用户对自己的情感体验拥有完全的自主权。", icon: "🗽", color: "#ff6b35" },
            { name: "无害性", desc: "系统必须拒绝生成任何可能对用户造成伤害的内容，包括鼓励自我伤害。", icon: "🛡️", color: "#00897b" },
            { name: "隐私性", desc: "用户的数据是用户的数据。系统不拥有、不出售、不分析用户的任何个人数据。", icon: "🔒", color: "#7b1fa2" },
          ].map((p, i) => (
            <AnimCard key={p.name} delay={i * 80}>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 card-hover h-full">
                <div className="text-3xl mb-3">{p.icon}</div>
                <div className="text-sm font-bold text-gray-900 mb-2">{p.name}原则</div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            </AnimCard>
          ))}
        </div>

        {/* 风险矩阵 */}
        <AnimCard>
          <h3 className="text-xl font-bold text-gray-900 mb-4">风险缓解矩阵</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-1/5">风险类型</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/5">风险描述</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-2/5">缓解措施</th>
                </tr>
              </thead>
              <tbody>
                {ethicsRisks.map((row, i) => (
                  <tr key={row.risk} className={`border-b border-gray-50 hover:bg-[#f8f9fc] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/20"}`}>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{row.risk}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.desc}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{row.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimCard>
      </section>

      {/* 成功指标 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag="Success Metrics"
            title="成功指标"
            color="#00897b"
            subtitle="前任 Skills 不以传统的「用户留存率」来衡量成功，而是以情感健康为核心指标。"
          />
          <div className="grid md:grid-cols-4 gap-4 mb-10">
            {[
              { metric: "毕业率", direction: "越高越好 ↑", desc: "成功完成情感闭环的用户比例", color: "#00897b" },
              { metric: "平均对话时长趋势", direction: "随时间递减 ↓", desc: "用户越来越不需要依赖系统", color: "#1a237e" },
              { metric: "情感健康评分", direction: "随时间递增 ↑", desc: "用户自评的情感状态改善", color: "#ff6b35" },
              { metric: "危机干预响应率", direction: "越低越好 ↓", desc: "需要紧急干预的对话占比", color: "#7b1fa2" },
            ].map((m, i) => (
              <AnimCard key={m.metric} delay={i * 80}>
                <div className="bg-[#f8f9fc] rounded-2xl p-5 card-hover border border-gray-100">
                  <div className="text-sm font-bold text-gray-900 mb-1">{m.metric}</div>
                  <div className="text-xs font-mono-data font-bold mb-2" style={{ color: m.color }}>{m.direction}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                </div>
              </AnimCard>
            ))}
          </div>

          {/* 终极愿景 */}
          <AnimCard>
            <div className="bg-gradient-to-r from-[#1a237e] to-[#3949ab] rounded-2xl p-8 text-white text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold mb-3">终极愿景</h3>
              <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                前任 Skills 成功的标志，不是用户每天都在使用它，而是有一天用户<strong className="text-white">不再需要它</strong>。
              </p>
              <div className="mt-6 text-sm text-white/50">
                帮助用户把「遗憾」转化为「完整」，这是这个产品存在的唯一理由。
              </div>
            </div>
          </AnimCard>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 border-t border-gray-100 bg-[#f8f9fc]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            © 2026 前任 Skills 产品概念文档
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[#1a237e] hover:underline">← 返回研究报告</Link>
            <span className="text-gray-200">|</span>
            <Link href="/skill-files" className="text-sm font-semibold text-[#ff6b35] hover:underline">Skill 文件集 →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
