/**
 * 文件上传与 AI 解析进度页面
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  ArrowLeft, Upload as UploadIcon, FileText, Image as ImageIcon, Video as VideoIcon, X,
  CheckCircle2, Loader2, Sparkles, AlertCircle, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FILE_TYPES: Record<string, { label: string; icon: any; accept: string; hint: string; type: "chat_txt" | "chat_csv" | "image" | "video" }> = {
  chat_txt: { label: "微信聊天记录 (.txt)", icon: FileText, accept: ".txt", hint: "微信导出的聊天记录文本文件", type: "chat_txt" },
  chat_csv: { label: "聊天记录 (.csv)", icon: FileText, accept: ".csv", hint: "CSV 格式的聊天记录", type: "chat_csv" },
  image:    { label: "照片", icon: ImageIcon, accept: "image/*", hint: "两人合照、截图等图片", type: "image" },
  video:    { label: "视频", icon: VideoIcon, accept: "video/*", hint: "视频文件（最大 50MB）", type: "video" },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMimeType(file: File, fileType: string): string {
  if (fileType === "chat_txt") return "text/plain";
  if (fileType === "chat_csv") return "text/csv";
  return file.type || "application/octet-stream";
}

export default function Upload() {
  const params = useParams<{ id: string }>();
  const personaId = parseInt(params.id || "0");
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const [uploadingFiles, setUploadingFiles] = useState<Record<string, "uploading" | "done" | "error">>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<keyof typeof FILE_TYPES>("chat_txt");

  const { data: persona, refetch: refetchPersona } = trpc.persona.get.useQuery(
    { id: personaId },
    { enabled: isAuthenticated && personaId > 0 }
  );

  const { data: files, refetch: refetchFiles } = trpc.file.list.useQuery(
    { personaId },
    { enabled: isAuthenticated && personaId > 0 }
  );

  const { data: analysisStatus, refetch: refetchStatus } = trpc.persona.getAnalysisStatus.useQuery(
    { id: personaId },
    {
      enabled: isAuthenticated && personaId > 0,
      refetchInterval: (query) => {
        const s = query.state.data?.status;
        return s === "analyzing" ? 1500 : false;
      },
    }
  );

  // 当解析完成时刷新
  useEffect(() => {
    if (analysisStatus?.status === "ready") {
      refetchPersona();
    }
  }, [analysisStatus?.status]);

  const uploadMutation = trpc.file.upload.useMutation({
    onError: (e) => toast.error("上传失败：" + e.message),
  });

  const triggerMutation = trpc.persona.triggerAnalysis.useMutation({
    onSuccess: () => {
      toast.success("AI 解析已开始，请稍候...");
      refetchStatus();
    },
    onError: (e) => toast.error("解析失败：" + e.message),
  });

  const handleFiles = useCallback(async (fileList: FileList) => {
    const arr = Array.from(fileList);
    for (const file of arr) {
      const key = `${file.name}-${Date.now()}`;
      setUploadingFiles((prev) => ({ ...prev, [key]: "uploading" }));
      try {
        const content = await fileToBase64(file);
        const ft = FILE_TYPES[selectedType];
        await uploadMutation.mutateAsync({
          personaId,
          fileName: file.name,
          fileType: ft.type,
          fileSize: file.size,
          fileContent: content,
          mimeType: getMimeType(file, selectedType),
        });
        setUploadingFiles((prev) => ({ ...prev, [key]: "done" }));
        toast.success(`${file.name} 上传成功`);
        refetchFiles();
      } catch {
        setUploadingFiles((prev) => ({ ...prev, [key]: "error" }));
      }
    }
  }, [personaId, selectedType, uploadMutation, refetchFiles]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const isAnalyzing = analysisStatus?.status === "analyzing";
  const isReady = analysisStatus?.status === "ready";
  const hasFiles = (files?.length || 0) > 0;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="container h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-white/50 hover:text-white hover:bg-white/5 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            返回大厅
          </Button>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-white font-medium">{persona?.name || "..."}</span>
          <span className="text-white/30 text-sm">· 上传资料</span>
        </div>
      </header>

      <main className="container py-8 max-w-2xl mx-auto">
        {/* Analysis Status */}
        {isReady ? (
          <div className="glass-card p-5 mb-6 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-medium">数字分身已准备好！</p>
                <p className="text-white/40 text-sm">{analysisStatus?.message}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/chat/${personaId}`)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0"
            >
              开始对话 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="glass-card p-5 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="text-white font-medium">AI 正在解析中...</p>
            </div>
            <p className="text-white/40 text-sm mb-3">{analysisStatus?.message}</p>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="progress-bar h-full"
                style={{ width: `${analysisStatus?.progress || 0}%` }}
              />
            </div>
            <p className="text-right text-xs text-white/30 mt-1">{analysisStatus?.progress || 0}%</p>
          </div>
        ) : analysisStatus?.status === "error" ? (
          <div className="glass-card p-5 mb-6 border-red-500/20 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-white/70 text-sm">{analysisStatus?.message || "解析失败，请重试"}</p>
            </div>
          </div>
        ) : null}

        {/* File Type Selector */}
        <div className="glass-card p-5 mb-5 animate-fade-in-up">
          <p className="text-white/60 text-sm mb-3 font-medium">选择文件类型</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(FILE_TYPES).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedType(key as keyof typeof FILE_TYPES)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    selectedType === key
                      ? "bg-pink-500/15 border-pink-400/40 text-white"
                      : "bg-white/3 border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium leading-tight">{cfg.label}</p>
                    <p className="text-xs opacity-50 leading-tight mt-0.5">{cfg.hint}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className={`glass-card p-8 mb-5 text-center border-2 border-dashed transition-all cursor-pointer animate-fade-in-up ${
            dragOver ? "border-pink-400/60 bg-pink-400/5" : "border-white/10 hover:border-white/20"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragOver ? "text-pink-400" : "text-white/20"}`} />
          <p className="text-white/60 font-medium mb-1">拖拽文件到这里，或点击选择</p>
          <p className="text-white/30 text-sm">支持 {FILE_TYPES[selectedType].accept} 格式</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_TYPES[selectedType].accept}
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        {/* Uploaded Files */}
        {hasFiles && (
          <div className="glass-card p-5 mb-5 animate-fade-in-up">
            <p className="text-white/60 text-sm font-medium mb-3">已上传文件 ({files?.length})</p>
            <div className="space-y-2">
              {files?.map((f: any) => {
                const Icon = FILE_TYPES[f.fileType]?.icon || FileText;
                return (
                  <div key={f.id} className="flex items-center gap-3 py-2 px-3 bg-white/3 rounded-lg">
                    <Icon className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <span className="text-sm text-white/70 flex-1 truncate">{f.originalName}</span>
                    <span className="text-xs text-white/30">{(f.fileSize / 1024).toFixed(0)} KB</span>
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Uploading Files */}
        {Object.entries(uploadingFiles).some(([, s]) => s === "uploading") && (
          <div className="glass-card p-4 mb-5 animate-fade-in">
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              正在上传...
            </div>
          </div>
        )}

        {/* Trigger Analysis */}
        {hasFiles && !isAnalyzing && !isReady && (
          <Button
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 text-base font-semibold animate-fade-in-up"
            onClick={() => triggerMutation.mutate({ id: personaId })}
            disabled={triggerMutation.isPending}
          >
            {triggerMutation.isPending ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />启动中...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" />开始 AI 解析，生成数字分身</>
            )}
          </Button>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-white/3 rounded-xl border border-white/5 animate-fade-in-up">
          <p className="text-white/40 text-xs font-medium mb-2">💡 上传建议</p>
          <ul className="text-white/30 text-xs space-y-1 leading-relaxed">
            <li>• 微信聊天记录：在微信 → 聊天详情 → 导出聊天记录 → 保存为 txt</li>
            <li>• 聊天记录越多，AI 分析越准确（建议至少 100 条消息）</li>
            <li>• 可以同时上传多种类型的文件，AI 会综合分析</li>
            <li>• 所有文件仅用于构建分身，不会被分享给任何第三方</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
