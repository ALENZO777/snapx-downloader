import { useState } from "react";
import { UrlInput } from "@/components/url-input";
import { VideoCard } from "@/components/video-card";
import { HistorySidebar } from "@/components/history-sidebar";
import { PlatformSupport } from "@/components/platform-support";
import { FAQSection } from "@/components/faq-section";
import { useResolveVideo, useBatchDownload } from "@/hooks/use-video";
import { VideoMetadata } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { DownloadCloud, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to generate a unique ID for temporary state
const generateId = () => Math.random().toString(36).substr(2, 9);

interface ResolvingItem {
  id: string;
  url: string;
  status: 'loading' | 'success' | 'error';
  data?: VideoMetadata;
  error?: string;
}

export default function Home() {
  const resolveMutation = useResolveVideo();
  const batchDownloadMutation = useBatchDownload();
  const [items, setItems] = useState<ResolvingItem[]>([]);

  const [isExpanded, setIsExpanded] = useState(true);

  const handleResolve = async (urls: string[]) => {
    // Add new placeholders
    const newItems = urls.map(url => ({
      id: generateId(),
      url,
      status: 'loading' as const
    }));

    setItems(prev => [...newItems, ...prev]);
    setIsExpanded(true); // Auto-expand when new items are added

    // Process each URL
    // We do this individually so the UI updates progressively
    for (const item of newItems) {
      try {
        const result = await resolveMutation.mutateAsync(item.url);
        setItems(prev => prev.map(p =>
          p.id === item.id
            ? { ...p, status: 'success', data: result }
            : p
        ));
      } catch (err) {
        setItems(prev => prev.map(p =>
          p.id === item.id
            ? { ...p, status: 'error', error: (err as Error).message }
            : p
        ));
      }
    }
  };

  const handleBatchDownload = () => {
    const validVideos = items
      .filter(item => item.status === 'success' && item.data)
      .map(item => item.data!);

    if (validVideos.length > 0) {
      batchDownloadMutation.mutate(validVideos);
    }
  };

  const successfulItems = items.filter(i => i.status === 'success');
  const hasMultipleSuccess = successfulItems.length > 1;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <DownloadCloud className="text-white w-5 h-5" />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight text-white">
              SnapX Downloader
            </h1>
          </div>
          <HistorySidebar />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center space-y-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
              Download from <span className="text-gradient">11+ Platforms</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm md:text-base text-white/50 max-w-2xl mx-auto"
          >
            YouTube, TikTok, Instagram, Facebook, Twitter, Reddit, Snapchat, SoundCloud, Douyin, SnackVideo, CapCut
          </motion.p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-16 relative z-10">
          <UrlInput
            onResolve={handleResolve}
            isResolving={resolveMutation.isPending}
          />
        </div>

        {/* Platform Support Section (Only show when no items) */}
        {items.length === 0 && (
          <PlatformSupport />
        )}

        {/* Results Section */}
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-display font-semibold text-white">
                    Results ({items.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/60 hover:text-white"
                  >
                    {isExpanded ? "Collapse All" : "Expand All"}
                  </Button>
                </div>
                {hasMultipleSuccess && (
                  <Button
                    onClick={handleBatchDownload}
                    disabled={batchDownloadMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-105 active:scale-95"
                  >
                    {batchDownloadMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <DownloadCloud className="w-4 h-4 mr-2" />
                    )}
                    Download All as ZIP
                  </Button>
                )}
              </div>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid gap-4"
                >
                  {items.map((item) => (
                    <div key={item.id}>
                      {item.status === 'loading' && (
                        <VideoCard
                          data={{ originalUrl: item.url } as any}
                          loading
                        />
                      )}
                      {item.status === 'error' && (
                        <VideoCard
                          data={{ originalUrl: item.url } as any}
                          error={item.error}
                        />
                      )}
                      {item.status === 'success' && item.data && (
                        <VideoCard data={item.data} />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-auto bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/30 text-sm">
            SnapX Downloader - Fast, Secure, Free
          </p>
          <p className="text-white/20 text-xs mt-1">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
