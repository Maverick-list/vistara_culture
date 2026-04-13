"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export default function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-2 rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white shadow-xl shadow-emerald-900/20 md:bottom-10"
        >
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
