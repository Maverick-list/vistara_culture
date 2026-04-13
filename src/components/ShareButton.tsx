"use client";

import { useState } from "react";
import { Share2, Link } from "lucide-react";
import Toast from "./Toast";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          fallbackCopy(shareUrl);
        }
      }
    } else {
      fallbackCopy(shareUrl);
    }
  };

  const fallbackCopy = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setToastMsg("Tautan berhasil disalin!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }).catch(() => {
      setToastMsg("Gagal menyalin tautan");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 ${className}`}
        title="Bagikan Destinasi"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Bagikan</span>
      </button>
      
      <Toast message={toastMsg} isVisible={showToast} />
    </>
  );
}
