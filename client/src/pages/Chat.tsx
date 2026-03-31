/**
 * 实时对话界面 — 与前任数字分身对话
 */
import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  ArrowLeft, Send, Heart, Sparkles, RefreshCw,
  ChevronDown, Info, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number | string;
  role: "user" | "assistant";
  content: string;
  emotionalState?: string;
  createdAt?: Date;
  isStreaming?: boolean;
}

// ─── Emotional State Config ───────────────────────────────────────────────────

const STATES: Record<string, { label: string; emoji: string; desc: string; color: string }> = {
  warm:       { label: "温柔",  emoji: "🌸", desc: "温柔体贴，充满关怀", color: "#f9a8d4" },
  playful:    { label: "俏皮",  emoji: "😄", desc: "轻松活泼，爱开玩笑", color: "#fde68a" },
  nostalgic:  { label: "思念",  emoji: "🌙", desc: "有些想念，带着回忆", color: "#93c5fd" },
  melancholy: { label: "忧郁",  emoji: "🌧️", desc: "情绪低落，需要安慰", color: "#c4b5fd" },
  happy:      { label: "开心",  emoji: "✨", desc: "心情很好，充满活力", color: "#86efac" },
  distant:    { label: "疏离",  emoji: "❄️", desc: "有些距离感，话不多", color: "#94a3b8" },
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const state = msg.emotionalState ? STATES[msg.emotionalState] : null;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-5`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
          <Heart className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {/* Emotional state badge */}
        {!isUser && state && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: state.color, background: `${state.color}20` }}>
            {state.emoji} {state.label}
          </span>
        )}

        {/* Bubble */}
        <div className={`px-4 py-3 text-sm leading-relaxed ${isUser ? "bubble-user" : "bubble-ai"}`}>
          {msg.isStreaming ? (
            <span>{msg.content}<span className="inline-block w-1 h-4 bg-white/60 ml-0.5 animate-pulse" /></span>
          ) : isUser ? (
            <span>{msg.content}</span>
          ) : (
            <Streamdown>{msg.content}</Streamdown>
          )}
        </div>

        {/* Time */}
        {msg.createdAt && !msg.isStreaming && (
          <span className="text-xs text-white/20">
            {new Date(msg.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Chat ────────────────────────────────────────────────────────────────

export default function Chat() {
  const params = useParams<{ id: string }>();
  const personaId = parseInt(params.id || "0");
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentState, setCurrentState] = useState("warm");
  const [showStatePanel, setShowStatePanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: persona } = trpc.persona.get.useQuery(
    { id: personaId },
    { enabled: isAuthenticated && personaId > 0 }
  );

  const { data: history } = trpc.chat.getHistory.useQuery(
    { personaId },
    { enabled: isAuthenticated && personaId > 0 }
  );

  const sendMutation = trpc.chat.send.useMutation({
    onError: (e: any) => {
      toast.error("发送失败：" + e.message);
      setIsSending(false);
    },
  });

  const changeStateMutation = trpc.persona.update.useMutation({
    onSuccess: (data: any) => {
      toast.success(`情感状态已切换`);
    },
  });

  // Load history
  useEffect(() => {
    if (history) {
      setMessages(history.map((m: any) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        emotionalState: m.emotionalState,
        createdAt: m.createdAt,
      })));
    }
  }, [history]);

  // Load persona emotional state
  useEffect(() => {
    if (persona?.emotionalState) setCurrentState(persona.emotionalState);
  }, [persona?.emotionalState]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);

    // Optimistic user message
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Streaming AI placeholder
    const streamId = `stream-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: streamId, role: "assistant", content: "", isStreaming: true, emotionalState: currentState },
    ]);

    try {
      const result = await sendMutation.mutateAsync({ personaId, message: text });

      // Replace streaming placeholder with real response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId
            ? {
                id: `ai-${Date.now()}`,
                role: "assistant",
                content: result.reply,
                emotionalState: result.emotionalState,
                createdAt: new Date(),
                isStreaming: false,
              }
            : m
        )
      );
      setCurrentState(result.emotionalState);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== streamId));
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const stateInfo = STATES[currentState] || STATES.warm;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5 flex-shrink-0">
        <div className="container h-16 flex items-center gap-3">
          <Button
            variant="ghost" size="sm"
            onClick={() => navigate("/")}
            className="text-white/50 hover:text-white hover:bg-white/5 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          {/* Persona Info */}
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {persona?.name?.charAt(0) || "?"}
            </div>
            <div>
              <p className="text-white font-medium text-sm leading-tight">{persona?.name || "..."}</p>
              <p className="text-white/40 text-xs leading-tight">{persona?.relationshipDesc || "前任"}</p>
            </div>
          </div>

          {/* Emotional State Button */}
          <button
            onClick={() => setShowStatePanel(!showStatePanel)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
            style={{
              color: stateInfo.color,
              background: `${stateInfo.color}18`,
              borderColor: `${stateInfo.color}40`,
            }}
          >
            {stateInfo.emoji} {stateInfo.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${showStatePanel ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* State Panel */}
        {showStatePanel && (
          <div className="border-t border-white/5 bg-[oklch(0.14_0.025_260)] px-4 py-3 animate-fade-in">
            <p className="text-white/40 text-xs mb-2">切换情感状态</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATES).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => {
                    changeStateMutation.mutate({ id: personaId, emotionalState: key as any });
            setCurrentState(key);
                    setShowStatePanel(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    currentState === key ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    color: s.color,
                    background: `${s.color}15`,
                    borderColor: `${s.color}35`,
                  }}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6 max-w-2xl mx-auto">
          {/* Welcome */}
          {messages.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="text-5xl mb-4 animate-float">
                {stateInfo.emoji}
              </div>
              <p className="text-white/60 font-medium mb-1">{persona?.name} 在等你</p>
              <p className="text-white/30 text-sm">{stateInfo.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {["最近怎么样？", "你还记得我们第一次见面吗？", "我有点想你了", "你现在在做什么？"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/50 hover:text-white/80 hover:bg-white/8 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 glass border-t border-white/5">
        <div className="container py-4 max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`对 ${persona?.name || "TA"} 说点什么...`}
              rows={1}
              className="flex-1 resize-none bg-white/5 border-white/15 text-white placeholder:text-white/25 focus:border-pink-400/50 rounded-xl min-h-[44px] max-h-32"
              style={{ height: "auto" }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="h-11 w-11 p-0 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 rounded-xl flex-shrink-0"
            >
              {isSending ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-white/20 text-xs mt-2 text-center">
            Enter 发送 · Shift+Enter 换行 · 点击情感状态切换 TA 的心情
          </p>
        </div>
      </div>
    </div>
  );
}
