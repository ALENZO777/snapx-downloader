import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRight } from "lucide-react";

interface UrlInputProps {
  onResolve: (urls: string[]) => void;
  isResolving: boolean;
}

export function UrlInput({ onResolve, isResolving }: UrlInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const urls = input
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://")));

    if (urls.length > 0) {
      onResolve(urls);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-card/60 backdrop-blur-sm rounded-xl border border-white/10 p-3 shadow-lg flex flex-col md:flex-row items-center gap-3 hover:border-white/20 transition-all"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste video URLs here (one per line)..."
          className="flex-1 bg-transparent border-none text-base resize-none min-h-[48px] focus-visible:ring-0 placeholder:text-white/40 py-2 px-1"
          disabled={isResolving}
        />
        <Button
          type="submit"
          disabled={isResolving || !input.trim()}
          className="h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-medium shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
        >
          {isResolving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing
            </>
          ) : (
            <>
              Fetch <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
