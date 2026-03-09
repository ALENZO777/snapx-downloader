import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "Which platforms are supported?",
        answer: "We support 11 platforms: YouTube (Shorts), TikTok, Instagram (Reels), Facebook (Reels), Twitter/X, Reddit, Snapchat, SoundCloud, Douyin, SnackVideo, and CapCut. All platforms support short-form video/reel content only, not regular posts or long videos."
    },
    {
        question: "Why is YouTube limited to 360p?",
        answer: "Due to API and processing limitations, YouTube downloads are currently limited to 360p resolution for Shorts. We're working on improving this in future updates. For now, this ensures fast and reliable downloads."
    },
    {
        question: "Can I download regular posts or long videos?",
        answer: "No, SnapX Downloader only supports short-form video content (Reels, Shorts, TikToks, etc.) across all platforms. Regular posts with images, carousel posts, and long-form videos are not supported."
    },
    {
        question: "Is there a download limit?",
        answer: "You can download multiple videos at once using our batch download feature. However, to ensure service quality for all users, we recommend downloading videos responsibly."
    },
    {
        question: "Is my data secure and private?",
        answer: "Yes! We don't store your video content or personal data. Videos are processed and delivered directly to you without being saved on our servers. We only keep minimal download history for the current session."
    },
    {
        question: "What about copyright and terms of service?",
        answer: "You are responsible for ensuring you have the right to download and use the content. Always respect copyright laws and the terms of service of each platform. Only download videos you have permission to use."
    }
];

export function FAQSection() {
    return (
        <div className="max-w-3xl mx-auto mb-12">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-display font-bold text-white">
                        Frequently Asked Questions
                    </h3>
                </div>
                <p className="text-white/60 text-sm">
                    Everything you need to know about SnapX Downloader
                </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="bg-white/5 border border-white/10 rounded-xl px-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                        <AccordionTrigger className="text-left text-white hover:text-primary transition-colors">
                            <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-white/70 leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
