/**
 * 前任 Skills 研究报告主页
 * 设计主题：极简科技研究报告（Swiss International Style）
 * 主色：深靛蓝 #1a237e | 强调：珊瑚橙 #ff6b35 | 辅助：薄荷绿 #00897b
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498638152/k3NXP97nDDdJxsrVs27ugh/hero-bg-mZXMiBYRmhaNsr69k8oNZa.webp";

// 雷达图数据
const radarData = [
  { subject: "工程化程度", colleague: 95, ex: 72 },
  { subject: "情感建模", colleague: 30, ex: 88 },
  { subject: "数据源多样性", colleague: 85, ex: 78 },
  { subject: "用户友好度", colleague: 55, ex: 48 },
  { subject: "多角色管理", colleague: 40, ex: 35 },
  { subject: "隐私保护", colleague: 70, ex: 75 },
];

// 特性对比条形图
const barData = [
  { name: "Prompt 结构", colleague: 90, ex: 82 },
  { name: "数据解析工具", colleague: 88, ex: 80 },
  { name: "版本管理", colleague: 85, ex: 78 },
  { name: "情感维度", colleague: 25, ex: 90 },
  { name: "安装便捷性", colleague: 60, ex: 55 },
];

// 优化方案数据
const optimizations = [
  {
    id: "01",
    title: "数字分身大厅",
    subtitle: "The Ex-Lobby",
    desc: "构建统一的多角色管理界面，支持在多个前任数字分身之间一键无缝切换，每个分身的上下文与情感状态完全隔离。",
    color: "#1a237e",
    icon: "🏛️",
    priority: "核心",
    effort: "高",
  },
  {
    id: "02",
    title: "动态情感建模",
    subtitle: "Deep Emotional Modeling",
    desc: "引入情感温度计系统，AI 的态度随对话动态变化。设定触发词机制，在纪念日或特定关键词出现时触发特殊情绪反应。",
    color: "#ff6b35",
    icon: "💓",
    priority: "核心",
    effort: "中",
  },
  {
    id: "03",
    title: "多模态交互",
    subtitle: "Multimodal Interaction",
    desc: "利用照片 EXIF 数据开发回忆触发器，AI 可主动发送曾经的照片或提及地理位置。进阶版支持语音克隆与 TTS 回复。",
    color: "#00897b",
    icon: "🎭",
    priority: "进阶",
    effort: "高",
  },
  {
    id: "04",
    title: "可视化数据导入",
    subtitle: "User-Friendly Onboarding",
    desc: "开发本地 Web 界面，用户可拖拽上传微信导出文件和照片，自动完成解析。提供引导式问卷，快速构建基础 Persona。",
    color: "#7b1fa2",
    icon: "📥",
    priority: "重要",
    effort: "中",
  },
  {
    id: "05",
    title: "隐私与情感安全",
    subtitle: "Privacy & Safety",
    desc: "强调本地化运行，所有敏感数据仅在本地处理。强化 Layer 0 硬规则，设定情感安全边界，防止过度依赖与二次伤害。",
    color: "#c62828",
    icon: "🔒",
    priority: "重要",
    effort: "低",
  },
];

// 对比表格数据
const comparisonRows = [
  { dim: "核心定位", colleague: "职场工作交接与技术规范传承", ex: "个人情感回忆与对话模拟" },
  { dim: "数据源支持", colleague: "飞书、钉钉、Slack、邮件、PDF", ex: "微信、QQ、朋友圈截图、照片 EXIF" },
  { dim: "Prompt 结构", colleague: "Work Skill + Persona（5层）", ex: "Relationship Memory + Persona（情感维度）" },
  { dim: "性格建模", colleague: "硬规则、身份、表达风格、决策模式、人际行为", ex: "依恋类型、爱的语言、争吵模式、甜蜜瞬间" },
  { dim: "进化机制", colleague: "追加工作文档 + 对话纠正 + 版本管理", ex: "追加聊天记录 + 照片 + 版本管理" },
  { dim: "多角色管理", colleague: "不支持", ex: "有限支持（无统一界面）" },
  { dim: "用户门槛", colleague: "中等（需企业工具权限）", ex: "较高（需手动导出聊天记录）" },
  { dim: "GitHub Stars", colleague: "~120", ex: "54" },
];

// 动画 hook
function useInView(threshold = 0.15) {
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

// 计数动画组件
function CountUp({ target, suffix = "", duration = 1500 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// 进度条组件
function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-mono-data font-medium" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: inView ? `${value}%` : "0%",
            backgroundColor: color,
            transition: "width 1.2s ease-out",
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"colleague" | "ex">("colleague");
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
          navScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#1a237e]">前任 Skills</span>
            <span className="text-xs px-2 py-0.5 bg-[#ff6b35]/10 text-[#ff6b35] rounded-full font-medium">研究报告</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {[
              { id: "overview", label: "概览" },
              { id: "comparison", label: "对比分析" },
              { id: "pros-cons", label: "优缺点" },
              { id: "optimization", label: "优化方案" },
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
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/therealXiaomanChu/ex-skill"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-[#1a237e] text-white rounded-md hover:bg-[#283593] transition-colors"
            >
              ex-skill ↗
            </a>
            <a
              href="https://github.com/titanwings/colleague-skill"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 border border-[#1a237e] text-[#1a237e] rounded-md hover:bg-[#1a237e]/5 transition-colors"
            >
              colleague-skill ↗
            </a>
          </div>
        </div>
      </nav>

      {/* 英雄区 */}
      <section
        id="overview"
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0d1b6e 0%, #1a237e 40%, #1e3a8a 70%, #0f2460 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1b6e]/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full animate-pulse" />
              深度研究报告 · 2026年3月
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              前任 Skills
              <br />
              <span className="text-[#ff6b35]">研究报告</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-2xl">
              深入解析 <strong className="text-white">colleague-skill</strong> 与 <strong className="text-white">ex-skill</strong> 两个开源项目，分析优缺点，规划下一代「前任数字分身」的优化路径。
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("comparison")}
                className="px-6 py-3 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#e55a2b] transition-colors shadow-lg"
              >
                查看对比分析 →
              </button>
              <button
                onClick={() => scrollTo("optimization")}
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
              >
                优化方案
              </button>
            </div>
          </div>

          {/* 统计数字 */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "分析维度", value: 8, suffix: "+" },
              { label: "优化方案", value: 5, suffix: "" },
              { label: "Prompt 模块", value: 7, suffix: "" },
              { label: "工具脚本", value: 6, suffix: "" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
                <div className="text-3xl font-bold text-white font-mono-data">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 项目概览卡片 */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* colleague-skill */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-mono-data text-[#1a237e] font-medium mb-1 uppercase tracking-wider">titanwings</div>
                <h3 className="text-2xl font-bold text-gray-900">colleague-skill</h3>
                <p className="text-sm text-gray-500 mt-1">同事.skill — 职场数字分身</p>
              </div>
              <div className="w-12 h-12 bg-[#1a237e]/10 rounded-xl flex items-center justify-center text-2xl">💼</div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              专为职场场景设计的 AI 数字分身构建工具，支持从飞书、钉钉、Slack 等企业通讯工具自动提取数据，构建具备工作能力与人物性格的完整数字分身。
            </p>
            <div className="space-y-2">
              <ProgressBar label="工程化程度" value={95} color="#1a237e" />
              <ProgressBar label="数据源多样性" value={85} color="#1a237e" />
              <ProgressBar label="Prompt 结构" value={90} color="#1a237e" />
              <ProgressBar label="情感建模" value={30} color="#94a3b8" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["飞书", "钉钉", "Slack", "邮件", "PDF", "版本管理"].map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-[#1a237e]/8 text-[#1a237e] rounded-md font-medium">{tag}</span>
              ))}
            </div>
          </div>

          {/* ex-skill */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-mono-data text-[#ff6b35] font-medium mb-1 uppercase tracking-wider">therealXiaomanChu</div>
                <h3 className="text-2xl font-bold text-gray-900">ex-skill</h3>
                <p className="text-sm text-gray-500 mt-1">前任.skill — 情感数字分身</p>
              </div>
              <div className="w-12 h-12 bg-[#ff6b35]/10 rounded-xl flex items-center justify-center text-2xl">💌</div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              基于 colleague-skill 改造的情感陪伴版本，将「工作能力」替换为「关系记忆」，支持微信、QQ、朋友圈和照片 EXIF 数据解析，重现前任的说话方式与情感特质。
            </p>
            <div className="space-y-2">
              <ProgressBar label="情感建模" value={88} color="#ff6b35" />
              <ProgressBar label="私人数据源" value={80} color="#ff6b35" />
              <ProgressBar label="场景精准度" value={85} color="#ff6b35" />
              <ProgressBar label="多角色管理" value={35} color="#94a3b8" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["微信", "QQ", "朋友圈", "照片EXIF", "依恋类型", "爱的语言"].map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-[#ff6b35]/8 text-[#ff6b35] rounded-md font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 可视化对比区 */}
      <section id="comparison" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <div className="text-xs font-mono-data text-[#ff6b35] font-medium uppercase tracking-wider mb-2">Visual Analysis</div>
            <h2 className="text-3xl font-bold text-gray-900">可视化对比分析</h2>
            <p className="text-gray-500 mt-2 max-w-xl">通过雷达图和条形图，直观呈现两个项目在各维度的差异与互补性。</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 雷达图 */}
            <div className="bg-[#f8f9fc] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-1">能力雷达图</h3>
              <p className="text-xs text-gray-500 mb-4">六维度综合能力对比（满分100）</p>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Radar name="colleague-skill" dataKey="colleague" stroke="#1a237e" fill="#1a237e" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="ex-skill" dataKey="ex" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.15} strokeWidth={2} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: value === "colleague-skill" ? "#1a237e" : "#ff6b35", fontSize: 12 }}>{value}</span>
                    )}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 条形图 */}
            <div className="bg-[#f8f9fc] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-1">核心特性评分</h3>
              <p className="text-xs text-gray-500 mb-4">五项核心特性的量化评估（满分100）</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} layout="vertical" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={90} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: value === "colleague" ? "#1a237e" : "#ff6b35", fontSize: 12 }}>
                        {value === "colleague" ? "colleague-skill" : "ex-skill"}
                      </span>
                    )}
                  />
                  <Bar dataKey="colleague" name="colleague" fill="#1a237e" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="ex" name="ex" fill="#ff6b35" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 详细对比表格 */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <div className="text-xs font-mono-data text-[#00897b] font-medium uppercase tracking-wider mb-2">Detailed Comparison</div>
          <h2 className="text-3xl font-bold text-gray-900">核心特性对比表</h2>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">维度</th>
                <th className="text-left px-6 py-4 w-[37.5%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#1a237e] rounded-full" />
                    <span className="text-sm font-bold text-[#1a237e]">colleague-skill</span>
                  </div>
                </th>
                <th className="text-left px-6 py-4 w-[37.5%]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ff6b35] rounded-full" />
                    <span className="text-sm font-bold text-[#ff6b35]">ex-skill</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.dim} className={`border-b border-gray-50 hover:bg-[#f8f9fc] transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{row.dim}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.colleague}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 优缺点分析 */}
      <section id="pros-cons" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <div className="text-xs font-mono-data text-[#1a237e] font-medium uppercase tracking-wider mb-2">Pros & Cons</div>
            <h2 className="text-3xl font-bold text-gray-900">优缺点深度分析</h2>
          </div>

          {/* Tab 切换 */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab("colleague")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "colleague"
                  ? "bg-[#1a237e] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              💼 colleague-skill
            </button>
            <button
              onClick={() => setActiveTab("ex")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "ex"
                  ? "bg-[#ff6b35] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              💌 ex-skill
            </button>
          </div>

          {activeTab === "colleague" && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
              {/* 优点 */}
              <div className="bg-[#f0f4ff] rounded-2xl p-6 border border-[#1a237e]/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">✅</span>
                  <h3 className="text-lg font-bold text-[#1a237e]">优点</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "完善的数据采集体系", desc: "支持飞书、钉钉、Slack 等企业级通讯工具的自动化数据采集，以及邮件、PDF 等多种格式，覆盖面广。" },
                    { title: "结构化的 Prompt 设计", desc: "将人物拆分为「工作能力」和「人物性格」，Persona 采用 5 层结构（硬规则→身份→表达风格→决策模式→人际行为），逻辑严密。" },
                    { title: "持续进化机制", desc: "支持通过追加文件或对话纠正动态更新 Skill，具备版本管理和回滚功能，工程化程度高。" },
                    { title: "工具链丰富", desc: "代码结构清晰，遵循 AgentSkills 标准，工具链（tools）非常丰富，可扩展性强。" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-[#1a237e] rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 缺点 */}
              <div className="bg-[#fff5f2] rounded-2xl p-6 border border-[#ff6b35]/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">⚠️</span>
                  <h3 className="text-lg font-bold text-[#c0392b]">缺点</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "场景局限于职场", desc: "高度定制化于职场场景，缺乏情感深度和私人关系记忆的建模，无法直接用于情感陪伴场景。" },
                    { title: "数据源偏向性强", desc: "主要依赖工作协同软件，不适用于提取私人生活中的情感交互数据（如微信聊天记录、朋友圈）。" },
                    { title: "情感维度缺失", desc: "Persona 建模中缺少依恋类型、爱的语言、争吵模式等情感专属维度，移植到情感场景需大量改造。" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ex" && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
              {/* 优点 */}
              <div className="bg-[#fff8f5] rounded-2xl p-6 border border-[#ff6b35]/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">✅</span>
                  <h3 className="text-lg font-bold text-[#ff6b35]">优点</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "场景精准转换", desc: "巧妙地将「工作能力」替换为「关系记忆」，使其精准适应情感陪伴场景，转换思路清晰且有效。" },
                    { title: "私人数据源支持", desc: "针对性开发了微信、QQ、社交媒体（朋友圈）和照片（EXIF 信息）的解析工具，贴合前任回忆的实际数据载体。" },
                    { title: "情感维度的 Prompt", desc: "引入依恋类型、爱的语言、争吵模式、甜蜜瞬间等情感维度，使生成的数字分身更具人情味和真实感。" },
                    { title: "双语文档", desc: "提供中英文 README，降低了国际用户的使用门槛，社区友好度较高（54 Stars，10 Forks）。" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 缺点 */}
              <div className="bg-[#f5f5f5] rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">⚠️</span>
                  <h3 className="text-lg font-bold text-gray-700">缺点</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "多角色管理体验较弱", desc: "虽然支持生成多个前任（通过不同 slug），但缺乏统一的、无缝切换的「数字分身」管理界面或机制，用户体验割裂。" },
                    { title: "数据导入门槛高", desc: "微信、QQ 聊天记录的导出和解析对普通用户技术门槛较高，依赖第三方导出工具，操作繁琐。" },
                    { title: "情感交互局限于文本", desc: "目前的交互仍以纯文本为主，未能充分利用照片、地理位置等多媒体信息进行富文本互动。" },
                    { title: "情感安全边界不明确", desc: "缺乏对过度依赖 AI 情感陪伴的风险提示和安全边界设定，可能对脆弱用户造成二次情感伤害。" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 优化方案 */}
      <section id="optimization" className="py-16 max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <div className="text-xs font-mono-data text-[#00897b] font-medium uppercase tracking-wider mb-2">Optimization Roadmap</div>
          <h2 className="text-3xl font-bold text-gray-900">「前任 Skills」优化路线图</h2>
          <p className="text-gray-500 mt-2 max-w-2xl">
            基于两个项目的深度分析，我们规划了五大核心优化方向，打造支持无缝切换数字分身的下一代前任 Skills 平台。
          </p>
        </div>

        <div className="space-y-4">
          {optimizations.map((opt, i) => (
            <div
              key={opt.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${opt.color}12` }}
                >
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-mono-data text-xs font-bold text-gray-400">{opt.id}</span>
                    <h3 className="text-lg font-bold text-gray-900">{opt.title}</h3>
                    <span className="text-xs text-gray-400 font-medium">{opt.subtitle}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: `${opt.color}15`, color: opt.color }}
                      >
                        {opt.priority}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                        实现难度：{opt.effort}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{opt.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 架构示意图 */}
        <div className="mt-12 bg-[#1a237e] rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">下一代前任 Skills 架构愿景</h3>
          <p className="text-white/60 text-sm mb-8">多角色数字分身管理平台的核心架构设计</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                layer: "数据层",
                items: ["微信/QQ 解析器", "照片 EXIF 提取", "朋友圈解析", "引导式问卷"],
                color: "#ff6b35",
              },
              {
                layer: "核心层",
                items: ["多角色 Persona 管理", "动态情感状态机", "触发词引擎", "记忆版本控制"],
                color: "#00c9a7",
              },
              {
                layer: "交互层",
                items: ["数字分身大厅 UI", "无缝切换机制", "多模态回复", "情感安全边界"],
                color: "#7c83fd",
              },
            ].map((layer) => (
              <div key={layer.layer} className="bg-white/8 rounded-xl p-5 border border-white/10">
                <div
                  className="text-xs font-mono-data font-bold uppercase tracking-wider mb-3"
                  style={{ color: layer.color }}
                >
                  {layer.layer}
                </div>
                <div className="space-y-2">
                  {layer.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 结语 */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-xs font-mono-data text-[#ff6b35] font-medium uppercase tracking-wider mb-3">Conclusion</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">总结</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            <strong>colleague-skill</strong> 提供了坚实的工程化基础，而 <strong>ex-skill</strong> 完成了情感场景的精准转换。两者的结合为「前任 Skills」提供了完整的技术蓝图。下一步的核心突破在于构建无缝切换的数字分身大厅、引入动态情感建模，以及大幅降低普通用户的使用门槛。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/concept"
              className="px-6 py-3 bg-[#1a237e] text-white rounded-lg font-semibold hover:bg-[#283593] transition-colors shadow-md"
            >
              查看产品概念文档 →
            </Link>
            <a
              href="https://github.com/therealXiaomanChu/ex-skill"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#ff6b35] text-white rounded-lg font-semibold hover:bg-[#e55a2b] transition-colors"
            >
              访问 ex-skill ↗
            </a>
            <a
              href="https://github.com/titanwings/colleague-skill"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-[#1a237e] text-[#1a237e] rounded-lg font-semibold hover:bg-[#1a237e]/5 transition-colors"
            >
              访问 colleague-skill ↗
            </a>
            <Link
              href="/skill-files"
              className="px-6 py-3 bg-[#00897b] text-white rounded-lg font-semibold hover:bg-[#00796b] transition-colors shadow-md"
            >
              查看 Skill 文件集 →
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 border-t border-gray-100 bg-[#f8f9fc]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            © 2026 前任 Skills 研究报告
          </div>
          <div className="text-sm text-gray-400">
            数据来源：
            <a href="https://github.com/titanwings/colleague-skill" className="text-[#1a237e] hover:underline mx-1">colleague-skill</a>
            ·
            <a href="https://github.com/therealXiaomanChu/ex-skill" className="text-[#ff6b35] hover:underline mx-1">ex-skill</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
