import React, { useState } from "react";
import { FolderOpen, Download, AlertCircle, CheckCircle, Loader2, Sparkles, FolderSync } from "lucide-react";
import { Track, Act } from "../playlistData";
import { motion, AnimatePresence } from "motion/react";

interface FolderDownloaderProps {
  acts: Act[];
  activeAct: Act;
}

interface DownloadJob {
  trackId: string;
  trackTitle: string;
  artist: string;
  actName: string;
  status: "idle" | "searching" | "downloading" | "saving" | "completed" | "failed";
  progress: number; // 0 to 100
  errorMsg?: string;
}

export default function FolderDownloader({ acts, activeAct }: FolderDownloaderProps) {
  const [directoryHandle, setDirectoryHandle] = useState<any>(null);
  const [directoryName, setDirectoryName] = useState<string>("");
  const [downloadQueue, setDownloadQueue] = useState<DownloadJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApiSupported, setIsApiSupported] = useState<boolean>(
    typeof window !== "undefined" && "showDirectoryPicker" in window
  );

  // 1. Request Folder Select
  const handleSelectFolder = async () => {
    try {
      const handle = await (window as any).showDirectoryPicker({
        mode: "readwrite",
        startIn: "downloads"
      });
      setDirectoryHandle(handle);
      setDirectoryName(handle.name);
    } catch (err: any) {
      console.warn("Folder picker declined or error:", err);
    }
  };

  // 2. Process a Single Download Job
  const processDownloadJob = async (job: DownloadJob, dirHandle: any): Promise<boolean> => {
    // Helper to update status in the state queue
    const updateJobStatus = (
      status: DownloadJob["status"],
      progress: number,
      errorMsg?: string
    ) => {
      setDownloadQueue((prev) =>
        prev.map((j) =>
          j.trackId === job.trackId && j.actName === job.actName
            ? { ...j, status, progress, errorMsg }
            : j
        )
      );
    };

    try {
      updateJobStatus("searching", 5);
      
      // A. Search YouTube video ID
      const query = `${job.artist} - ${job.trackTitle}`;
      const searchRes = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!searchRes.ok) throw new Error("Erro na busca de vídeo");
      const videoData = await searchRes.json();
      const videoId = videoData.id;
      if (!videoId) throw new Error("Vídeo não localizado");

      updateJobStatus("downloading", 20);

      // B. Fetch direct stream from proxy backend
      const downloadUrl = `/api/download?id=${videoId}&title=${encodeURIComponent(query)}`;
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Falha ao receber stream de áudio");

      const contentLength = response.headers.get("content-length");
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream indisponível");

      let receivedBytes = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedBytes += value.length;
          if (totalBytes > 0) {
            const percent = Math.min(
              20 + Math.round((receivedBytes / totalBytes) * 70), // scale to 20-90% range
              90
            );
            updateJobStatus("downloading", percent);
          }
        }
      }

      updateJobStatus("saving", 92);

      // Combine chunks to Blob
      const blob = new Blob(chunks, { type: "audio/mpeg" });

      // C. Get or create directory for Act
      const safeActFolderName = job.actName.replace(/[^a-zA-Z0-9\s\-_]/g, "").trim();
      const actFolderHandle = await dirHandle.getDirectoryHandle(safeActFolderName, { create: true });

      // D. Get or create MP3 file
      const safeFileName = `${job.artist} - ${job.trackTitle}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s\-_]/g, "")
        .trim();
        
      const fileHandle = await actFolderHandle.getFileHandle(`${safeFileName}.mp3`, { create: true });

      // E. Write blob
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();

      updateJobStatus("completed", 100);
      return true;
    } catch (error: any) {
      console.error(`Error processing job for "${job.trackTitle}":`, error);
      updateJobStatus("failed", 0, error.message || "Erro desconhecido");
      return false;
    }
  };

  // 3. Queue Processor Loop
  const startQueueProcessor = async (jobs: DownloadJob[]) => {
    if (isProcessing || !directoryHandle) return;
    setIsProcessing(true);

    // Filter out jobs already completed
    let activeJobs = [...jobs];
    setDownloadQueue(activeJobs);

    for (let i = 0; i < activeJobs.length; i++) {
      const currentJob = activeJobs[i];
      if (currentJob.status === "completed") continue;
      
      const success = await processDownloadJob(currentJob, directoryHandle);
      // Brief pause between tracks to prevent YouTube/Cobalt throttling
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setIsProcessing(false);
  };

  // 4. Download Active Act
  const downloadActiveAct = () => {
    if (!directoryHandle) return;
    
    const jobs: DownloadJob[] = activeAct.tracks.map((track) => ({
      trackId: track.searchQuery,
      trackTitle: track.title,
      artist: track.artist,
      actName: `Ato ${activeAct.number} - ${activeAct.name}`,
      status: "idle",
      progress: 0
    }));

    startQueueProcessor(jobs);
  };

  // 5. Download ALL Acts
  const downloadAllActs = () => {
    if (!directoryHandle) return;

    const jobs: DownloadJob[] = [];
    acts.forEach((act) => {
      act.tracks.forEach((track) => {
        jobs.push({
          trackId: track.searchQuery,
          trackTitle: track.title,
          artist: track.artist,
          actName: `Ato ${act.number} - ${act.name}`,
          status: "idle",
          progress: 0
        });
      });
    });

    startQueueProcessor(jobs);
  };

  // Clean Completed Queue Items
  const clearQueue = () => {
    if (isProcessing) return;
    setDownloadQueue([]);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background Subtle Red Pattern */}
      <div className="absolute inset-0 bg-radial from-red-600/5 to-transparent pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between mb-4 relative z-10 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <FolderSync className="w-5 h-5 text-red-500 animate-pulse" />
          <h3 className="font-sans font-bold text-lg text-white uppercase tracking-wider">
            Gravador de Playlist Organizado
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
          FSA_API_V1
        </span>
      </div>

      {/* FSA API Support check */}
      {!isApiSupported ? (
        <div className="bg-yellow-900/20 border border-yellow-700/30 text-yellow-400 p-4 rounded-xl text-xs flex gap-3 relative z-10">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold mb-1">Limitação do Navegador</p>
            <p className="leading-relaxed">
              Seu navegador não oferece suporte à gravação de pastas locais (disponível no Chrome, Edge ou Opera). 
              <strong> Você ainda pode baixar músicas individualmente</strong> na lista abaixo clicando nos botões de download de cada faixa!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {/* Explanation */}
          <p className="text-zinc-400 text-xs leading-relaxed">
            Selecione uma pasta no seu computador. O gravador irá buscar as faixas automaticamente e salvá-las organizadas em <strong>subpastas por Atos (Ato 1, Ato 2, etc.)</strong> como arquivos MP3 de alta fidelidade!
          </p>

          {/* Directory Select Section */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800 shadow-inner">
            <button
              onClick={handleSelectFolder}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer disabled:opacity-50"
            >
              <FolderOpen className="w-4 h-4 text-red-500" />
              Selecionar Pasta Local
            </button>
            <div className="flex-1 min-w-0 flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-mono">Pasta:</span>
              <span className="text-white font-mono font-semibold truncate bg-zinc-900 px-2 py-1 rounded border border-zinc-800 max-w-xs">
                {directoryName || "Nenhuma selecionada"}
              </span>
              {directoryHandle && (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
            </div>
          </div>

          {/* Download Action Triggers */}
          {directoryHandle && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={downloadActiveAct}
                disabled={isProcessing}
                className="flex-1 min-w-[150px] flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-900/50 hover:border-red-600/50 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                Gravar {activeAct.name.split(" ")[0] || "Ato Atual"} ({activeAct.tracks.length} Musicas)
              </button>

              <button
                onClick={downloadAllActs}
                disabled={isProcessing}
                className="flex-1 min-w-[150px] flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-2 px-3 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Gravar Playlist Completa (74 Musicas)
              </button>
            </div>
          )}

          {/* Live Queue Display */}
          {downloadQueue.length > 0 && (
            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 shadow-md">
              {/* Queue Header */}
              <div className="bg-zinc-900/60 px-3 py-2 border-b border-zinc-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-300">
                  Fila de Gravação ({downloadQueue.filter((j) => j.status === "completed").length}/{downloadQueue.length})
                </span>
                {!isProcessing && (
                  <button
                    onClick={clearQueue}
                    className="text-[10px] text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Limpar Fila
                  </button>
                )}
              </div>

              {/* Queue Items List */}
              <div className="max-h-[220px] overflow-y-auto divide-y divide-zinc-900 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                  {downloadQueue.map((job, index) => {
                    const isCurrent = job.status !== "idle" && job.status !== "completed" && job.status !== "failed";
                    return (
                      <motion.div
                        key={`${job.trackId}-${job.actName}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-2.5 flex items-center gap-3 text-xs transition-colors ${
                          isCurrent ? "bg-red-950/10" : ""
                        }`}
                      >
                        {/* Status Icon */}
                        <div className="shrink-0">
                          {job.status === "idle" && (
                            <div className="w-4 h-4 rounded-full border border-zinc-700 bg-zinc-900" />
                          )}
                          {job.status === "searching" && (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                          )}
                          {job.status === "downloading" && (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          )}
                          {job.status === "saving" && (
                            <div className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center">
                              <span className="text-[8px] text-amber-500 font-bold">W</span>
                            </div>
                          )}
                          {job.status === "completed" && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          {job.status === "failed" && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>

                        {/* Song Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className="font-semibold text-zinc-200 truncate pr-2">
                              {job.artist} - {job.trackTitle}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                              {job.status === "idle" && "Aguardando"}
                              {job.status === "searching" && "Buscando link"}
                              {job.status === "downloading" && `Baixando... ${job.progress}%`}
                              {job.status === "saving" && "Gravando disco"}
                              {job.status === "completed" && "Concluído ✓"}
                              {job.status === "failed" && "Falhou ⚠"}
                            </span>
                          </div>

                          {/* Progress Line */}
                          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800/50">
                            <div
                              className={`h-full transition-all duration-300 ${
                                job.status === "failed"
                                  ? "bg-red-600"
                                  : job.status === "completed"
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>

                          {/* Subfolder Info & Error logs */}
                          <div className="flex justify-between items-center mt-1 text-[9px] text-zinc-500 font-mono">
                            <span className="truncate max-w-[200px]">
                              Pasta: {job.actName}
                            </span>
                            {job.errorMsg && (
                              <span className="text-red-400 font-sans truncate max-w-[150px]">
                                {job.errorMsg}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
