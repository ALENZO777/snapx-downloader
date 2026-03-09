import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api, type ResolveRequest, type VideoMetadata, type BatchRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { HistoryStorage, type HistoryItem } from "@/lib/history-storage";
import { useState, useEffect } from "react";

export function useResolveVideo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      const data: ResolveRequest = { url };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      try {
        const res = await fetch(api.resolve.path, {
          method: api.resolve.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          if (res.status === 400) {
            const error = await res.json();
            throw new Error(error.message || 'Invalid URL provided');
          }
          if (res.status === 502) {
            throw new Error('Could not resolve video from this source');
          }
          throw new Error('Failed to resolve video');
        }

        const result = api.resolve.responses[200].parse(await res.json());

        if (!result.success) {
          throw new Error(result.error || 'Failed to resolve video');
        }

        return result;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. The video source might be slow or unavailable.');
        }
        throw err;
      }
    },
    onSuccess: (result) => {
      // Save to localStorage history
      HistoryStorage.addItem({
        originalUrl: result.originalUrl,
        title: result.title,
        videoUrl: result.videoUrl,  // Store the download link
        thumbnail: result.thumbnail,
        source: result.source,
      });

      // Invalidate history query to trigger re-render
      queryClient.invalidateQueries({ queryKey: ['download-history'] });
    },
    onError: (error) => {
      // We handle specific errors in the UI, but this is a fallback
      console.error("Resolution error:", error);
    }
  });
}

export function useBatchDownload() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (videos: VideoMetadata[]) => {
      const data: BatchRequest = { videos };
      const res = await fetch(api.downloadBatch.path, {
        method: api.downloadBatch.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create download package');
      }

      // Handle binary response
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `videos-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      return true;
    },
    onError: (error: Error) => {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// localStorage-based history hook
export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from localStorage
  const loadHistory = () => {
    setIsLoading(true);
    const items = HistoryStorage.getHistory();
    setHistory(items);
    setIsLoading(false);
  };

  // Load on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // React Query integration for consistency
  return useQuery({
    queryKey: ['download-history'],
    queryFn: async () => {
      return HistoryStorage.getHistory();
    },
    initialData: history,
    refetchOnWindowFocus: false, // No need to refetch since it's local
  });
}

// Clear history utility
export function useClearHistory() {
  const queryClient = useQueryClient();

  return () => {
    HistoryStorage.clearHistory();
    queryClient.invalidateQueries({ queryKey: ['download-history'] });
  };
}

