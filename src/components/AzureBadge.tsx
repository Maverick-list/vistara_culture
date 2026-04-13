"use client";

import { motion } from "framer-motion";

interface AzureBadgeProps {
  isActive?: boolean;
  className?: string;
}

export default function AzureBadge({ isActive = false, className = "" }: AzureBadgeProps) {
  return (
    <a
      href="https://azure.microsoft.com/en-us/solutions/ai/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-white px-3 py-1.5 shadow-sm transition-all hover:bg-amber-50 hover:shadow ${className}`}
    >
      <div className="relative flex h-5 w-5 items-center justify-center shrink-0">
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-blue-500"
          />
        )}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 relative z-10"
        >
          <path d="M22.0494 15.6883L13.8213 2.15549C13.5682 1.7397 13.0645 1.5 12.5512 1.5H11.4488C10.9355 1.5 10.4318 1.7397 10.1787 2.15549L1.95064 15.6883C1.65082 16.1812 1.6366 16.7876 1.91264 17.2941C2.18868 17.8006 2.71439 18.1184 3.29294 18.1184H6.28471L12 8.73038L17.7153 18.1184H20.7071C21.2856 18.1184 21.8113 17.8006 22.0874 17.2941C22.3634 16.7876 22.3492 16.1812 22.0494 15.6883Z" fill="#0078D4"/>
          <path d="M12 11.2696L7.84478 18.1184H16.1552L12 11.2696Z" fill="#0078D4"/>
          <path d="M10.8448 19.3881L12 21.288L13.1552 19.3881H10.8448Z" fill="#50E6FF"/>
        </svg>
      </div>
      <span className="text-[10px] sm:text-xs font-semibold text-amber-900/60 uppercase tracking-widest">
        Powered by <strong className="text-[#0078D4]">Azure</strong>
      </span>
    </a>
  );
}
