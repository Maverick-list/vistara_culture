"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

// ── Props ────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  /** Callback when search query changes (debounced from SearchBar) */
  onSearch: (query: string) => void;
}

// ── Batik-inspired SVG pattern (kawung motif) ────────────────────────────

const BATIK_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Ccircle cx='0' cy='0' r='6'/%3E%3Ccircle cx='80' cy='0' r='6'/%3E%3Ccircle cx='0' cy='80' r='6'/%3E%3Ccircle cx='80' cy='80' r='6'/%3E%3Ccircle cx='40' cy='0' r='3'/%3E%3Ccircle cx='40' cy='80' r='3'/%3E%3Ccircle cx='0' cy='40' r='3'/%3E%3Ccircle cx='80' cy='40' r='3'/%3E%3Cpath d='M40 20 Q50 30 40 40 Q30 30 40 20z' opacity='0.4'/%3E%3Cpath d='M40 40 Q50 50 40 60 Q30 50 40 40z' opacity='0.4'/%3E%3Cpath d='M20 40 Q30 50 40 40 Q30 30 20 40z' opacity='0.4'/%3E%3Cpath d='M40 40 Q50 30 60 40 Q50 50 40 40z' opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`;

// ── Animation variants ───────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      ease: "easeInOut" as const,
      repeat: Infinity,
    },
  },
};

// ── Component ────────────────────────────────────────────────────────────

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-gradient-to-br from-amber-950 via-amber-900 to-emerald-950"
    >
      {/* ── Batik pattern background layer ───────────────────────── */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{ backgroundImage: BATIK_PATTERN }}
        aria-hidden="true"
      />

      {/* ── Decorative gradient orbs ─────────────────────────────── */}
      <motion.div
        variants={floatVariants}
        animate="animate"
        className="absolute -top-20 -right-20 h-[28rem] w-[28rem] rounded-full bg-amber-500/8 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        variants={floatVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-600/8 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-yellow-500/5 blur-3xl"
        aria-hidden="true"
      />

      {/* ── Diagonal decorative lines (batik-inspired) ───────────── */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)",
        }}
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-6 pb-28 pt-24 md:pb-36 md:pt-32 lg:pb-40 lg:pt-36"
      >
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-300 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Cultural Guide
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Jelajahi{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Jiwa Budaya
              </span>
              {/* Decorative underline */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-amber-400/80 to-yellow-400/40"
              />
            </span>{" "}
            Nusantara
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-amber-200/60 md:text-xl"
          >
            Dari kemegahan Borobudur hingga keheningan Wae Rebo — temukan makna
            di balik setiap destinasi melalui lensa budaya, sejarah, dan
            kearifan lokal yang telah hidup berabad-abad.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="mt-10 grid grid-cols-3 gap-8 md:gap-16"
          >
            {[
              { value: "12", label: "Destinasi" },
              { value: "7", label: "Pulau" },
              { value: "6", label: "Kategori" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-amber-400 md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-amber-400/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Search bar embedded in hero */}
          <motion.div variants={itemVariants} className="mt-12 w-full max-w-2xl">
            <SearchBar
              onSearch={onSearch}
              variant="hero"
              placeholder="Cari candi, desa adat, pulau, atau tradisi..."
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom wave transition ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            className="fill-amber-50"
          />
        </svg>
      </div>
    </section>
  );
}
