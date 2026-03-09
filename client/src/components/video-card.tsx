import { VideoMetadata } from "@shared/schema";
import { Download, ExternalLink, Play, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface VideoCardProps {
  data: VideoMetadata;
  loading?: boolean;
  error?: string | null;
}

export function VideoCard({ data, loading, error }: VideoCardProps) {
  if (loading) {
    return (
      <Card className="glass-card overflow-hidden p-0 animate-pulse border-white/5">
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-64 h-48 bg-white/5" />
          <div className="p-6 flex-1 space-y-4">
            <div className="h-6 w-3/4 bg-white/5 rounded" />
            <div className="h-4 w-1/2 bg-white/5 rounded" />
            <div className="h-10 w-32 bg-white/5 rounded mt-4" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/20 p-6 flex items-center gap-4">
        <div className="p-3 rounded-full bg-red-500/20 text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-red-200">Failed to Resolve</h3>
          <p className="text-red-300/70 text-sm mt-1">{error}</p>
          <p className="text-xs text-white/30 mt-2 font-mono truncate max-w-[300px]">{data.originalUrl}</p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
    >
      <Card className="glass-card overflow-hidden p-0 group hover:border-white/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail Section */}
          <div className="relative w-full md:w-72 aspect-video md:aspect-auto bg-black/50 overflow-hidden">
            {data.thumbnail ? (
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <Play className="w-12 h-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>

          <div className="p-4 md:p-6 flex-1 flex flex-col justify-between min-w-0">
            <div className="space-y-1">
              <h3 className="text-lg md:text-xl font-bold text-white leading-tight break-words">
                {data.title || "Untitled Video"}
              </h3>
              <a
                href={data.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm text-white/40 hover:text-primary transition-colors w-full"
              >
                <span className="truncate">{data.originalUrl}</span>
                <ExternalLink className="w-3 h-3 ml-1.5 opacity-50 shrink-0" />
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl"
                asChild
              >
                <a href={data.videoUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download MP4
                </a>
              </Button>

              <span className="flex items-center text-xs text-green-400 font-medium px-3 py-1 bg-green-400/10 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1.5" />
                Ready
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
