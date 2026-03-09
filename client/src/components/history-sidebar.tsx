import { useHistory, useClearHistory } from "@/hooks/use-video";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, Clock, ExternalLink, Download, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function HistorySidebar() {
  const { data: history, isLoading } = useHistory();
  const clearHistory = useClearHistory();
  const { toast } = useToast();

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all download history?")) {
      clearHistory();
      toast({
        title: "History Cleared",
        description: "Your download history has been cleared.",
      });
    }
  };

  const handleDownload = (videoUrl: string, title: string) => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `${title}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();

    toast({
      title: "Download Started",
      description: `Downloading ${title}`,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
          <History className="w-5 h-5 mr-2" />
          History
          {history && history.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
              {history.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-card/95 backdrop-blur-xl border-l border-white/10 w-full sm:w-[400px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-display text-white">Recent Downloads</SheetTitle>
            {history && history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-white/40 hover:text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)] mt-6 pr-4">
          {isLoading ? (
            <div className="text-center py-10 text-white/30">Loading history...</div>
          ) : history?.length === 0 ? (
            <div className="text-center py-10">
              <History className="w-12 h-12 mx-auto mb-3 text-white/10" />
              <p className="text-white/30">No download history yet</p>
              <p className="text-white/20 text-sm mt-1">Your downloads will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history?.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-sm font-medium text-white line-clamp-2 leading-snug flex-1">
                      {item.title || "Untitled Video"}
                    </h4>
                    <span className="text-[10px] text-white/30 uppercase tracking-wider shrink-0 bg-white/5 px-2 py-1 rounded">
                      {item.source || "WEB"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {item.createdAt && formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDownload(item.videoUrl, item.title)}
                      className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 hover:border-primary/40 transition-all"
                    >
                      <Download className="w-3 h-3 mr-1.5" />
                      Download Again
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="text-white/40 hover:text-primary hover:bg-primary/10"
                    >
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
