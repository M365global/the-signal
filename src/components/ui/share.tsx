"use client";

import { Share } from "lucide-react";

export default function ShareButton({ title, text }: { title: string, text: string }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard."); 
      }
    } catch (error) {
      console.log("Error sharing", error);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="text-zinc-500 border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all p-2 rounded-none print:hidden"
      aria-label="Share this post"
    >
      <Share className="w-4 h-4" />
    </button>
  );
}