/**
 * SkillFiles.tsx — 前任 Skills 文件结构展示页
 * 设计主题：极简科技研究报告（Swiss International Style）
 * 主色：深靛蓝 #1a237e | 强调：珊瑚橙 #ff6b35 | 辅助：薄荷绿 #00897b
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

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

// ─── 文件树数据 ───────────────────────────────────────────────────────────────

const FILE_TREE = [
  {
    name: "ex-skill/",
    type: "dir",
    desc: "Skill 根目录",
    children: [
      {
        name: "SKILL.md",
        type: "file",
        ext: "md",
        desc: "核心入口文件：工作流总览、快速开始指南、情感健康守护规则",
        lines: 102,
        key: true,
      },
      {
        name: "scripts/",
        type: "dir",
        desc: "可执行脚本",
        children: [
          { name: "parse_chat.py", type: "file", ext: "py", desc: "聊天记录解析器：支持微信/QQ/纯文本，自动计算情感权重", lines: 198 },
          { name: "build_persona.py", type: "file", ext: "py", desc: "7层 Persona 构建器：从记忆库提炼人格模型，生成 System Prompt", lines: 210 },
          { name: "chat.py", type: "file", ext: "py", desc: "对话引擎：动态情感状态更新、危机检测、健康监测", lines: 220 },
          { name: "lobby.py", type: "file", ext: "py", desc: "数字分身大厅：多角色管理、切换、毕业操作", lines: 165 },
        ],
      },
      {
        name: "references/",
        type: "dir",
        desc: "参考文档（按需加载）",
        children: [
          { name: "persona_layers.md", type: "file", ext: "md", desc: "7层 Persona 完整规范：每层的数据结构、构建 Prompt 模板", lines: 180 },
          { name: "prompt_templates.md", type: "file", ext: "md", desc: "对话 Prompt 模板库：基础版、场景专用片段、毕业信模板", lines: 160 },
          { name: "emotional_states.md", type: "file", ext: "md", desc: "情感状态机规范：6维向量定义、更新规则、健康监测算法", lines: 195 },
          { name: "safety_guidelines.md", type: "file", ext: "md", desc: "安全边界与危机干预：禁止内容、危机词汇检测、伦理声明", lines: 140 },
        ],
      },
    ],
  },
];

// ─── 文件内容预览数据 ─────────────────────────────────────────────────────────

const FILE_PREVIEWS: Record<string, { title: string; content: string; color: string }> = {
  "SKILL.md": {
    title: "SKILL.md — 核心入口",
    color: "#1a237e",
    content: `---
name: ex-skill
description: 前任数字分身模拟系统（Emotional Memory OS）。
  用于构建基于真实聊天记录的前任 AI 数字分身，
  支持多角色管理与无缝切换，内置情感健康守护机制。
---

# 前任 Skills — 情感记忆操作系统

## 核心原则
建模对象是「一段关系」，不是「一个人」。
最终目标是帮助用户完成情感闭环，而非制造依赖。

## 工作流总览
1. 数据采集  →  2. 构建 Persona  →  3. 建立记忆库
→  4. 启动对话  →  5. 多角色管理

## Step 1：数据采集与解析
python parse_chat.py \\
  --input <聊天记录> --format wechat \\
  --output data/<角色名>/memories.json`,
  },
  "parse_chat.py": {
    title: "parse_chat.py — 聊天记录解析器",
    color: "#2e7d32",
    content: `def calculate_emotional_weight(msg, all_messages, idx,
    relationship_start, relationship_end) -> float:
    """计算单条消息的情感权重（1.0 为基础权重）"""
    weight = 1.0

    # 规则1：手动标注的关键记忆
    if msg.get("is_key"):
        weight *= 5.0
        return weight  # 最高权重，直接返回

    # 规则2：关系开始/结束前后 30 天
    days_from_end = abs((msg_time - relationship_end).days)
    if days_from_end <= 30:
        weight *= 3.0

    # 规则3：包含强烈情绪词汇
    emotion_count = sum(1 for w in STRONG_EMOTION_WORDS
                        if w in text)
    if emotion_count >= 2:
        weight *= 2.0

    # 规则4：密集对话段（间隔 < 2 分钟）
    if gap < 120:
        weight *= 1.5

    return round(weight, 2)`,
  },
  "build_persona.py": {
    title: "build_persona.py — Persona 构建器",
    color: "#e65100",
    content: `# 7 层 Persona 结构
persona = {
  # Layer 0: 硬规则（不可绕过）
  "layer_0_safety": {
    "crisis_words": ["自杀", "轻生", "不想活"],
    "must_confirm_ai": True,
  },
  # Layer 1: 身份锚点
  "layer_1_identity": {
    "name": "小A",
    "relationship_stage": "分手后",
  },
  # Layer 2: 语言风格（从聊天记录自动提取）
  "layer_2_language": {
    "favorite_emojis": ["😂", "🙄", "😭"],
    "imperfections": {
      "typo_rate": 0.03,
      "incomplete_sentences": True,
    },
  },
  # Layer 5: 动态情感状态（实时更新）
  "layer_5_emotional_state": {
    "current": {
      "intimacy": 0.4,
      "temperature": 0.4,
      "nostalgia": 0.6,
    }
  },
}`,
  },
  "chat.py": {
    title: "chat.py — 对话引擎",
    color: "#6a1b9a",
    content: `# 危机检测
def detect_crisis(text: str) -> str:
    for w in CRISIS_WORDS_HIGH:
        if w in text:
            return "high"
    return "safe"

# 情感状态动态更新
def update_emotional_state(state, user_text):
    if any(w in user_text for w in ["想你", "感谢"]):
        state["intimacy"] = min(1.0,
            state["intimacy"] + 0.08)
    if any(w in user_text for w in ["分手", "离开"]):
        state["intimacy"] = max(0.0,
            state["intimacy"] - 0.1)
    # 深夜加成
    if 23 <= datetime.now().hour or hour <= 2:
        state["time_awareness"] = min(1.0,
            state["time_awareness"] + 0.3)
    return state

# 对话循环（保留最近 10 轮上下文）
response = call_llm(
    system_prompt,
    conversation_history[-10:],
    name
)`,
  },
  "lobby.py": {
    title: "lobby.py — 数字分身大厅",
    color: "#00695c",
    content: `# 大厅展示所有分身
def print_lobby(personas):
    for i, p in enumerate(personas, 1):
        name = p["layer_1_identity"]["name"]
        stage = p["layer_1_identity"]["stage"]
        state = p["layer_5_emotional_state"]["current"]
        graduation = p["meta"]["graduation_status"]

        status_icon = {
          "active": "💬",
          "suggested": "🌱",
          "graduated": "✨"
        }.get(graduation)

        print(f"[{i}] {status_icon} {name}")
        print(f"    阶段：{stage}")
        print(f"    亲密 {bar(state['intimacy'])}")
        print(f"    怀念 {bar(state['nostalgia'])}")

# 毕业操作
elif choice.startswith("g"):
    p["meta"]["graduation_status"] = "graduated"
    print("✨ 感谢那段时光，也感谢你有勇气走到这一步。")`,
  },
  "persona_layers.md": {
    title: "persona_layers.md — 7层规范",
    color: "#1565c0",
    content: `## Layer 5：动态情感状态（核心创新）

状态向量（6维，每维 0.0-1.0）：
| 维度       | 低值     | 高值     | 默认  |
|-----------|---------|---------|------|
| intimacy  | 疏离     | 亲密     | 0.50 |
| temperature| 冷淡    | 热烈     | 0.50 |
| sensitivity| 平静   | 触发     | 0.20 |
| time_aware | 日常   | 特殊时刻  | 0.00 |
| trust      | 戒备   | 开放     | 0.60 |
| nostalgia  | 淡然   | 思念     | 0.30 |

## Layer 6：关系轨迹感知（全新维度）

分身「知道」这段关系的完整轨迹：
- 不假装分手没发生
- 但也不把分手当成对话的中心
- 语气：温柔的遗憾，而不是痛苦的执念`,
  },
  "safety_guidelines.md": {
    title: "safety_guidelines.md — 安全指南",
    color: "#c62828",
    content: `## 危机干预话术（高风险）

[分身立即停止角色扮演，以系统身份说话]

我需要先暂停一下。

我注意到你说了一些让我很担心的话。
我是一个 AI，我没有办法真正陪伴你，
但有真实的人可以帮助你。

如果你现在感到很痛苦，请联系：
• 北京心理危机：010-82951332
• 全国心理援助：400-161-9995
• 生命热线：400-821-1215

你不需要一个人扛着这些。

## 伦理声明（首次启动必须确认）

✓ 我了解我正在和 AI 对话，而不是真实的人
✓ 我不会将 AI 生成的内容用于欺骗他人
✓ 我将对自己的情感健康负责`,
  },
};

// ─── 文件树组件 ───────────────────────────────────────────────────────────────

function FileNode({
  node,
  depth,
  onSelect,
  selected,
}: {
  node: any;
  depth: number;
  onSelect: (name: string) => void;
  selected: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const isDir = node.type === "dir";
  const isSelected = selected === node.name;

  const extColors: Record<string, string> = {
    md: "#1565c0",
    py: "#2e7d32",
    json: "#e65100",
    txt: "#757575",
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all text-sm ${
          isSelected ? "bg-[#1a237e]/10 text-[#1a237e]" : "hover:bg-gray-50 text-gray-700"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isDir) setExpanded(!expanded);
          else onSelect(node.name);
        }}
      >
        {isDir ? (
          <span className="text-amber-500">{expanded ? "📂" : "📁"}</span>
        ) : (
          <span
            className="text-xs font-mono font-bold px-1 rounded"
            style={{
              color: extColors[node.ext] || "#757575",
              backgroundColor: `${extColors[node.ext] || "#757575"}15`,
            }}
          >
            .{node.ext}
          </span>
        )}
        <span className={`font-mono text-sm ${isDir ? "font-bold" : ""}`}>{node.name}</span>
        {node.key && (
          <span className="text-xs px-1.5 py-0.5 bg-[#ff6b35]/10 text-[#ff6b35] rounded-full font-medium">核心</span>
        )}
        {node.lines && (
          <span className="ml-auto text-xs text-gray-400">{node.lines}L</span>
        )}
      </div>
      {isDir && expanded && node.children && (
        <div>
          {node.children.map((child: any) => (
            <FileNode
              key={child.name}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function SkillFiles() {
  const [selectedFile, setSelectedFile] = useState("SKILL.md");
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"files" | "workflow" | "quickstart">("files");

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const preview = FILE_PREVIEWS[selectedFile];

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['DM_Sans','Noto_Sans_SC',sans-serif]">
      {/* 导航栏 */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-[#1a237e] transition-colors">← 研究报告</Link>
            <span className="text-gray-200">|</span>
            <Link href="/concept" className="text-sm text-gray-400 hover:text-[#1a237e] transition-colors">产品概念</Link>
            <span className="text-gray-200">|</span>
            <span className="text-sm font-bold text-[#1a237e]">Skill 文件</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full border border-green-200 font-medium">✓ 验证通过</span>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-200 font-medium">MVP Phase 1</span>
          </div>
        </div>
      </nav>

      {/* 标题区 */}
      <section className="pt-28 pb-10 max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#ff6b35] uppercase tracking-widest mb-2">Skill Files · MVP Deliverable</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3">
              前任 Skills
              <br />
              <span className="text-[#1a237e]">完整文件集</span>
            </h1>
            <p className="text-gray-500 max-w-xl leading-relaxed">
              基于三阶段技术路线图的 MVP 核心交付。9 个文件，覆盖数据解析、人格构建、对话引擎、多角色管理与情感安全守护。
            </p>
          </div>
          {/* 统计 */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: "9", label: "文件总数" },
              { num: "4", label: "核心脚本" },
              { num: "4", label: "参考文档" },
              { num: "7", label: "Persona 层级" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 min-w-[90px]">
                <div className="text-2xl font-bold text-[#1a237e]">{s.num}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mt-8 flex-wrap">
          {[
            { id: "files", label: "📁 文件浏览器" },
            { id: "workflow", label: "🔄 完整工作流" },
            { id: "quickstart", label: "⚡ 快速开始" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#1a237e] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 文件浏览器 Tab */}
      {activeTab === "files" && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* 文件树 */}
            <AnimCard className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-[#f8f9fc] flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-mono text-gray-400 ml-2">~/skills/ex-skill/</span>
                </div>
                <div className="p-3">
                  {FILE_TREE.map((node) => (
                    <FileNode
                      key={node.name}
                      node={node}
                      depth={0}
                      onSelect={setSelectedFile}
                      selected={selectedFile}
                    />
                  ))}
                </div>
              </div>
            </AnimCard>

            {/* 文件预览 */}
            <AnimCard className="lg:col-span-3" delay={100}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                {preview ? (
                  <>
                    <div
                      className="px-5 py-3 border-b border-gray-100 flex items-center gap-3"
                      style={{ borderTop: `3px solid ${preview.color}` }}
                    >
                      <span className="text-sm font-bold text-gray-800">{preview.title}</span>
                    </div>
                    {/* 文件描述 */}
                    {(() => {
                      const allFiles = FILE_TREE[0].children.flatMap((c: any) =>
                        c.children ? c.children : [c]
                      );
                      const fileInfo = allFiles.find((f: any) => f.name === selectedFile);
                      return fileInfo ? (
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                          {fileInfo.desc}
                        </div>
                      ) : null;
                    })()}
                    <div className="p-5">
                      <pre
                        className="text-xs leading-relaxed overflow-x-auto font-mono text-gray-700 bg-[#f8f9fc] rounded-xl p-4 border border-gray-100"
                        style={{ maxHeight: "420px", overflowY: "auto" }}
                      >
                        {preview.content}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📄</div>
                      <div className="text-sm">点击左侧文件查看预览</div>
                    </div>
                  </div>
                )}
              </div>
            </AnimCard>
          </div>
        </section>
      )}

      {/* 工作流 Tab */}
      {activeTab === "workflow" && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {[
              { step: "01", title: "数据采集", script: "parse_chat.py", color: "#1a237e", icon: "📥",
                desc: "解析微信/QQ聊天记录，计算情感权重，提取高权重记忆片段" },
              { step: "02", title: "构建 Persona", script: "build_persona.py", color: "#2e7d32", icon: "🧬",
                desc: "从记忆库提炼 7 层人格模型，生成 System Prompt，标注 TODO 字段" },
              { step: "03", title: "手动补充", script: "persona.json", color: "#e65100", icon: "✏️",
                desc: "填写脚本无法自动推断的字段：关键事件、inside jokes、分手原因" },
              { step: "04", title: "启动对话", script: "chat.py", color: "#6a1b9a", icon: "💬",
                desc: "加载 Persona，开始对话，情感状态实时更新，危机检测全程运行" },
              { step: "05", title: "多角色管理", script: "lobby.py", color: "#00695c", icon: "🏛️",
                desc: "在数字分身大厅管理所有角色，切换、查看状态、执行毕业仪式" },
            ].map((s, i) => (
              <AnimCard key={s.step} delay={i * 80}>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full relative">
                  {i < 4 && (
                    <div className="hidden md:block absolute top-8 -right-2 z-10 text-gray-300 text-lg">→</div>
                  )}
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="text-xs font-mono font-bold mb-1" style={{ color: s.color }}>Step {s.step}</div>
                  <div className="text-sm font-bold text-gray-900 mb-1">{s.title}</div>
                  <div className="text-xs font-mono text-gray-400 mb-3 bg-gray-50 px-2 py-1 rounded">{s.script}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </AnimCard>
            ))}
          </div>

          {/* 数据流图 */}
          <AnimCard>
            <div className="bg-[#1a237e] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-5">数据流与文件依赖关系</h3>
              <div className="font-mono text-sm text-white/80 leading-loose">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-[#ff6b35] font-bold mb-2">输入</div>
                    <div className="space-y-1 text-xs">
                      <div className="bg-white/10 rounded px-3 py-2">聊天记录.txt（微信/QQ）</div>
                      <div className="bg-white/10 rounded px-3 py-2">照片 EXIF（可选）</div>
                      <div className="bg-white/10 rounded px-3 py-2">手动问卷（无记录时）</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-amber-300 font-bold mb-2">处理</div>
                    <div className="space-y-1 text-xs">
                      <div className="bg-white/10 rounded px-3 py-2">parse_chat.py → memories.json</div>
                      <div className="bg-white/10 rounded px-3 py-2">build_persona.py → persona.json</div>
                      <div className="bg-white/10 rounded px-3 py-2">ChromaDB 向量索引（记忆检索）</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-green-300 font-bold mb-2">运行时</div>
                    <div className="space-y-1 text-xs">
                      <div className="bg-white/10 rounded px-3 py-2">chat.py（对话 + 状态更新）</div>
                      <div className="bg-white/10 rounded px-3 py-2">lobby.py（多角色管理）</div>
                      <div className="bg-white/10 rounded px-3 py-2">LLM API（OpenAI / Anthropic）</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimCard>
        </section>
      )}

      {/* 快速开始 Tab */}
      {activeTab === "quickstart" && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 安装与配置 */}
            <AnimCard>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>⚙️</span> 安装与配置
                </h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "安装依赖", code: "pip install openai anthropic chromadb snownlp" },
                    { step: "2", title: "设置 API Key", code: "export OPENAI_API_KEY=sk-..." },
                    { step: "3", title: "准备聊天记录", code: "# 微信：设置 → 聊天 → 聊天记录迁移与备份 → 导出\n# 将导出的 .txt 文件放到任意目录" },
                  ].map((item) => (
                    <div key={item.step}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white text-xs flex items-center justify-center font-bold">{item.step}</span>
                        <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                      </div>
                      <pre className="text-xs bg-gray-900 text-green-400 rounded-lg p-3 font-mono overflow-x-auto">{item.code}</pre>
                    </div>
                  ))}
                </div>
              </div>
            </AnimCard>

            {/* 第一次运行 */}
            <AnimCard delay={100}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🚀</span> 第一次运行（5分钟上手）
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "解析聊天记录",
                      code: `python parse_chat.py \\
  --input ~/wechat_export.txt \\
  --format wechat \\
  --output data/小A/memories.json \\
  --user-name 你的微信昵称 \\
  --relationship-start 2022-03-14 \\
  --relationship-end 2024-06-01`,
                    },
                    {
                      step: "2",
                      title: "构建 Persona",
                      code: `python build_persona.py \\
  --memories data/小A/memories.json \\
  --name 小A \\
  --stage 分手后 \\
  --output data/小A/persona.json
# 然后用编辑器打开 persona.json，填写所有 TODO 字段`,
                    },
                    {
                      step: "3",
                      title: "开始对话",
                      code: `python chat.py \\
  --persona data/小A/persona.json \\
  --memories data/小A/memories.json`,
                    },
                  ].map((item) => (
                    <div key={item.step}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-[#ff6b35] text-white text-xs flex items-center justify-center font-bold">{item.step}</span>
                        <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                      </div>
                      <pre className="text-xs bg-gray-900 text-green-400 rounded-lg p-3 font-mono overflow-x-auto whitespace-pre-wrap">{item.code}</pre>
                    </div>
                  ))}
                </div>
              </div>
            </AnimCard>

            {/* 特殊指令 */}
            <AnimCard delay={150}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>⌨️</span> 对话中的特殊指令
                </h3>
                <div className="space-y-2">
                  {[
                    { cmd: "/status", desc: "查看当前分身的 6 维情感状态向量（进度条可视化）" },
                    { cmd: "/memory <关键词>", desc: "从记忆库中检索包含该关键词的高权重记忆片段" },
                    { cmd: "/switch <角色名>", desc: "切换到另一个数字分身（上下文完全隔离）" },
                    { cmd: "/lobby", desc: "返回数字分身大厅，管理所有角色" },
                    { cmd: "/exit", desc: "结束对话，自动保存情感状态到 persona.json" },
                  ].map((item) => (
                    <div key={item.cmd} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <code className="text-xs font-mono font-bold text-[#1a237e] bg-[#1a237e]/10 px-2 py-1 rounded whitespace-nowrap">{item.cmd}</code>
                      <span className="text-xs text-gray-600 leading-relaxed">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimCard>

            {/* TODO 字段说明 */}
            <AnimCard delay={200}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>✏️</span> 需要手动填写的 TODO 字段
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  脚本会自动提取语言风格和情感权重，但以下字段需要你根据真实记忆手动填写，这些是让分身「真实」的关键。
                </p>
                <div className="space-y-2">
                  {[
                    { field: "nickname", layer: "L1", desc: "前任叫你什么，你叫TA什么" },
                    { field: "key_events", layer: "L4", desc: "3-5 个关键事件（第一次约会、第一次吵架等）" },
                    { field: "inside_jokes", layer: "L4", desc: "只有你们才懂的梗和暗语" },
                    { field: "conflict_triggers", layer: "L3", desc: "什么话题容易引发冲突" },
                    { field: "what_was_left_unsaid", layer: "L6", desc: "那些想说但没说出口的话" },
                    { field: "breakup_reason_brief", layer: "L1", desc: "分手的简要原因（影响对话基调）" },
                  ].map((item) => (
                    <div key={item.field} className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 whitespace-nowrap">{item.layer}</span>
                      <div>
                        <code className="text-xs font-mono text-gray-700">{item.field}</code>
                        <span className="text-xs text-gray-500 ml-2">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimCard>
          </div>
        </section>
      )}

      {/* 页脚导航 */}
      <footer className="py-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            前任 Skills MVP · Phase 1 完成 · 验证通过
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-[#1a237e] hover:underline">研究报告</Link>
            <span className="text-gray-200">|</span>
            <Link href="/concept" className="text-[#1a237e] hover:underline">产品概念文档</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
