import { Video, Music, Image, Users, Twitter, MessageCircle, Ghost, Cloud, Sparkles, Film, Scissors } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const platforms = [
    {
        name: "YouTube",
        icon: Video,
        emoji: "🎥",
        limitation: "Shorts only • Max 360p resolution",
        color: "text-red-400"
    },
    {
        name: "TikTok",
        icon: Music,
        emoji: "🎵",
        limitation: "Short videos only • No slideshows",
        color: "text-cyan-400"
    },
    {
        name: "Instagram",
        icon: Image,
        emoji: "📸",
        limitation: "Reels only • No posts/stories",
        color: "text-pink-400"
    },
    {
        name: "Facebook",
        icon: Users,
        emoji: "👥",
        limitation: "Reels only • No regular videos",
        color: "text-blue-400"
    },
    {
        name: "Twitter/X",
        icon: Twitter,
        emoji: "🐦",
        limitation: "Short videos only • No posts",
        color: "text-sky-400"
    },
    {
        name: "Reddit",
        icon: MessageCircle,
        emoji: "📱",
        limitation: "Short videos only • No image posts",
        color: "text-orange-400"
    },
    {
        name: "Snapchat",
        icon: Ghost,
        emoji: "👻",
        limitation: "Public snaps only • Video reels",
        color: "text-yellow-400"
    },
    {
        name: "SoundCloud",
        icon: Cloud,
        emoji: "🎧",
        limitation: "Audio tracks only • No videos",
        color: "text-orange-300"
    },
    {
        name: "Douyin",
        icon: Sparkles,
        emoji: "🎭",
        limitation: "Short videos only • No posts",
        color: "text-purple-400"
    },
    {
        name: "SnackVideo",
        icon: Film,
        emoji: "🎬",
        limitation: "Short videos only",
        color: "text-green-400"
    },
    {
        name: "CapCut",
        icon: Scissors,
        emoji: "✂️",
        limitation: "Shared videos only",
        color: "text-indigo-400"
    },
];

export function PlatformSupport() {
    return (
        <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold text-white mb-3">
                    Supported Platforms
                </h3>
                <p className="text-white/60 text-sm">
                    Download from your favorite platforms with ease
                </p>
            </div>

            <TooltipProvider>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {platforms.map((platform) => {
                        const IconComponent = platform.icon;
                        return (
                            <Tooltip key={platform.name}>
                                <TooltipTrigger asChild>
                                    <div className="group relative p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`${platform.color} transition-transform group-hover:scale-110`}>
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-medium text-white/80 text-center">
                                                {platform.name}
                                            </span>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="bg-black/90 border-white/20">
                                    <p className="text-xs font-medium">{platform.emoji} {platform.name}</p>
                                    <p className="text-xs text-white/60 mt-1">{platform.limitation}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </TooltipProvider>

            {/* Important Notice */}
            <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                    <div className="text-amber-400 mt-0.5">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-amber-300 mb-1">Important Limitations</h4>
                        <ul className="text-xs text-amber-100/80 space-y-1">
                            <li>• <strong>YouTube:</strong> Shorts only, maximum 360p resolution</li>
                            <li>• <strong>All Platforms:</strong> Short videos/reels only (no image posts or long videos)</li>
                            <li>• <strong>SoundCloud:</strong> Audio tracks only (no video content)</li>
                            <li>• <strong>Respect copyright:</strong> Only download content you have rights to use</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
