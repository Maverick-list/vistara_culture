"use client";

import { useDemoMode } from "@/hooks/useDemoMode";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoBanner() {
  const { isDemoMode } = useDemoMode();

  return (
    <AnimatePresence>
      {isDemoMode && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-amber-500 py-1.5 px-4 text-xs font-bold text-amber-950 shadow-md sm:text-sm"
        >
          <AlertTriangle className="h-4 w-4" />
          Mode Demo Aktif — Menampilkan contoh respons AI tanpa menggunakan API Key sungguhan.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
