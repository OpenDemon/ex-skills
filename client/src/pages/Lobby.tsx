/**
 * 数字分身大厅 — 前任 Skills 主界面
 * 展示所有前任数字分身，支持创建、切换、进入对话
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Plus, MessageCircle, Upload, Trash2, Heart,
  Sparkles, Clock, ChevronRight, LogOut, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ─── 情感状态配置 ─────────────────────────────────────────────────────────────

const EMOTIONAL_STATES: Record<string, { label: string; emoji: string; color: string }> = {
  warm:      { label: "温柔",  emoji: "🌸", color: "state-warm" },
  playful:   { label: "俏皮",  emoji: "😄", color: "state-playful" },
  nostalgic: { label: "思念",  emoji: "🌙", color: "state-nostalgic" },
  melancholy:{ label: "忧郁",  emoji: "🌧️", color: "state-melancholy" },
  happy:     { label: "开心",  emoji: "✨", color: "state-happy" },
  distant:   { label: "疏离",  emoji: "❄️", color: "state-distant" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  pending:   { label: "待上传", color: "text-yellow-400", dot: "bg-yellow-400" },
  analyzing: { label: "解析中", color: "text-blue-400",   dot: "bg-blue-400 animate-pulse" },
  ready:     { label: "可对话", color: "text-green-400",  dot: "bg-green-400" },
  error:     { label: "解析失败", color: "text-red-400",  dot: "bg-red-400" },
};

// ─── Avatar Generator ─────────────────────────────────────────────────────────

function generateAvatar(name: string): string {
  const colors = [
    ["#f093fb", "#f5576c"],
    ["#4facfe", "#00f2fe"],
    ["#43e97b", "#38f9d7"],
    ["#fa709a", "#fee140"],
    ["#a18cd1", "#fbc2eb"],
    ["#ffecd2", "#fcb69f"],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const [c1, c2] = colors[idx];
  const char = name.charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="100%" style="stop-color:${c2}"/>
    </linearGradient></defs>
    <circle cx="40" cy="40" r="40" fill="url(#g)"/>
    <text x="40" y="52" font-family="sans-serif" font-size="32" font-weight="600" fill="white" text-anchor="middle">${char}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// ─── Persona Card ─────────────────────────────────────────────────────────────

function PersonaCard({
  persona,
  onChat,
  onUpload,
  onDelete,
}: {
  persona: any;
  onChat: () => void;
  onUpload: () => void;
  onDelete: () => void;
}) {
  const state = EMOTIONAL_STATES[persona.emotionalState] || EMOTIONAL_STATES.warm;
  const status = STATUS_CONFIG[persona.analysisStatus] || STATUS_CONFIG.pending;
  const avatar = persona.avatarUrl || generateAvatar(persona.name);

  return (
    <div className="glass-card p-6 flex flex-col gap-4 group cursor-pointer" onClick={persona.analysisStatus === "ready" ? onChat : undefined}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={avatar}
              alt={persona.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white/10"
            />
            <span className="absolute -bottom-1 -right-1 text-lg">{state.emoji}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{persona.name}</h3>
            <p className="text-sm text-white/50">{persona.relationshipDesc || "前任"}</p>
          </div>
        </div>
        {/* Status Badge */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Emotional State */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium state-bg-${persona.emotionalState} ${state.color} w-fit`}>
        <Heart className="w-3.5 h-3.5" />
        {state.label}模式
      </div>

      {/* Stats */}
      {persona.analysisStatus === "ready" && (
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {persona.chatCount} 次对话
          </span>
          {persona.lastChatAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(persona.lastChatAt).toLocaleDateString("zh-CN")}
            </span>
          )}
          {persona.togetherFrom && (
            <span>{persona.togetherFrom} — {persona.togetherTo || "至今"}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
        {persona.analysisStatus === "ready" ? (
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
            onClick={(e) => { e.stopPropagation(); onChat(); }}
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            开始对话
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            onClick={(e) => { e.stopPropagation(); onUpload(); }}
          >
            <Upload className="w-4 h-4 mr-1.5" />
            {persona.analysisStatus === "pending" ? "上传资料" : "查看进度"}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="text-white/30 hover:text-red-400 hover:bg-red-400/10 px-2"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Create Persona Dialog ────────────────────────────────────────────────────

function CreatePersonaDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: number) => void;
}) {
  const [name, setName] = useState("");
  const [rel, setRel] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const createMutation = trpc.persona.create.useMutation({
    onSuccess: (data) => {
      toast.success(`${name} 的数字分身已创建！`);
      onCreated(data.id);
      setName(""); setRel(""); setFrom(""); setTo("");
    },
    onError: (e) => toast.error("创建失败：" + e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[oklch(0.16_0.025_260)] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            创建新的数字分身
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-white/70 text-sm mb-1.5 block">前任的名字 / 昵称 *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：小雨、阿明、Cherry..."
              className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-pink-400/50"
            />
          </div>
          <div>
            <Label className="text-white/70 text-sm mb-1.5 block">关系描述</Label>
            <Input
              value={rel}
              onChange={(e) => setRel(e.target.value)}
              placeholder="例如：大学恋人、初恋、异地恋..."
              className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-pink-400/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/70 text-sm mb-1.5 block">在一起时间</Label>
              <Input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="2020年3月"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-pink-400/50"
              />
            </div>
            <div>
              <Label className="text-white/70 text-sm mb-1.5 block">分开时间</Label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="2022年8月"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-pink-400/50"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-white/50 hover:text-white">
            取消
          </Button>
          <Button
            disabled={!name.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate({ name: name.trim(), relationshipDesc: rel, togetherFrom: from, togetherTo: to })}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
          >
            {createMutation.isPending ? "创建中..." : "创建分身"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Lobby ───────────────────────────────────────────────────────────────

export default function Lobby() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: personas, refetch } = trpc.persona.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: (query) => {
      // 如果有正在解析的分身，每3秒轮询一次
      const data = query.state.data;
      if (Array.isArray(data) && data.some((p: any) => p.analysisStatus === "analyzing")) {
        return 3000;
      }
      return false;
    },
  });

  const deleteMutation = trpc.persona.delete.useMutation({
    onSuccess: () => { toast.success("已删除"); refetch(); setDeleteId(null); },
    onError: (e) => toast.error("删除失败：" + e.message),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50 text-sm animate-pulse">加载中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-sm w-full animate-fade-in-up">
          <div className="text-5xl mb-4 animate-float">💌</div>
          <h1 className="text-2xl font-bold text-white mb-2">前任 Skills</h1>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            上传聊天记录，让 AI 重建你的前任数字分身，随时与 TA 对话。
          </p>
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 h-11"
            onClick={() => window.location.href = getLoginUrl()}
          >
            登录开始使用
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">前任 Skills</span>
            <span className="text-xs px-2 py-0.5 bg-pink-500/15 text-pink-400 rounded-full border border-pink-500/20">Beta</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <User className="w-4 h-4" />
              <span>{user?.name || "用户"}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white/30 hover:text-white/70 hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-10">
        {/* Title */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-2">
            你的数字分身大厅
          </h2>
          <p className="text-white/40 text-sm">
            {personas?.length
              ? `共 ${personas.length} 个分身 · 上传聊天记录，让 AI 重建 TA 的一切`
              : "还没有任何分身，创建第一个吧"}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Create Card */}
          <button
            onClick={() => setShowCreate(true)}
            className="glass-card p-6 flex flex-col items-center justify-center gap-3 min-h-[220px] border-dashed border-white/10 hover:border-pink-400/30 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-400/10 transition-colors">
              <Plus className="w-7 h-7 text-white/30 group-hover:text-pink-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-white/50 font-medium group-hover:text-white/80 transition-colors">创建新分身</p>
              <p className="text-white/25 text-xs mt-1">上传聊天记录 / 照片 / 视频</p>
            </div>
          </button>

          {/* Persona Cards */}
          {personas?.map((persona: any, i: number) => (
            <div
              key={persona.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <PersonaCard
                persona={persona}
                onChat={() => navigate(`/chat/${persona.id}`)}
                onUpload={() => navigate(`/upload/${persona.id}`)}
                onDelete={() => setDeleteId(persona.id)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {personas?.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4 animate-float">💔</div>
            <p className="text-white/30 text-lg mb-2">还没有任何前任分身</p>
            <p className="text-white/20 text-sm">点击上方「创建新分身」开始</p>
          </div>
        )}
      </main>

      {/* Create Dialog */}
      <CreatePersonaDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(id) => {
          setShowCreate(false);
          refetch();
          navigate(`/upload/${id}`);
        }}
      />

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[oklch(0.16_0.025_260)] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-white/60 text-sm py-2">
            删除后，该分身的所有数据（包括对话记录）将永久消失，无法恢复。
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-white/50">取消</Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
