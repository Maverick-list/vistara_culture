"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

// ── Props ────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  /** Callback when search query changes (debounced from SearchBar) */
  onSearch: (query: string) => void;
}

// ── Batik-inspired CSS pattern (Sogan-inspired) ──────────────────────────
const BATIK_CSS_PATTERN = `repeating-linear-gradient(45deg, rgba(251, 191, 36, 0.03), rgba(251, 191, 36, 0.03) 40px, transparent 40px, transparent 80px)`;

// ── Animation variants ───────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// ── Component ────────────────────────────────────────────────────────────

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const headline = "Jelajahi Jiwa Budaya Nusantara";

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-gradient-to-br from-[#1c1404] via-[#2d1e05] to-[#0a1b15] pt-12"
    >
      {/* ── Batik pattern background layer ───────────────────────── */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.4]"
        style={{ backgroundImage: BATIK_CSS_PATTERN }}
        aria-hidden="true"
      />

      {/* ── Decorative gradient orbs ─────────────────────────────── */}
      <motion.div
        variants={floatVariants}
        animate="animate"
        className="absolute -top-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden="true"
      />
      <motion.div
        variants={floatVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl"
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto max-w-5xl px-6 pb-28 pt-24 md:pb-36 md:pt-32 lg:pb-40 lg:pt-36"
      >
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-1.5 text-sm font-medium text-amber-300/80 backdrop-blur-sm shadow-xl shadow-black/20"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            AI-Powered Cultural Concierge
          </motion.div>

          {/* Headline with stagger words */}
          <motion.h1
            variants={itemVariants}
            className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-4 gap-y-2 text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl"
          >
            {headline.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={word === "Budaya" || word === "Jiwa" ? "bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent" : ""}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-amber-200/50 md:text-xl lg:px-8"
          >
            Temukan kekayaan sejarah, filosofi tersembunyi, dan kearifan lokal 
            Nusantara yang dirancang khusus oleh AI untuk perjalanan yang lebih bermakna.
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {[
              { value: 12, label: "Destinasi" },
              { value: 6, label: "Pulau" },
              { value: 5, label: "Kategori Budaya" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="flex items-baseline gap-0.5">
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1 + idx * 0.2 }}
                    className="text-3xl font-bold text-white md:text-4xl"
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-amber-400 text-xl">+</span>
                </div>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/40 group-hover:text-amber-400/70 transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Search bar embedded in hero */}
          <motion.div variants={itemVariants} className="mt-14 w-full max-w-2xl">
            <SearchBar
              onSearch={onSearch}
              variant="hero"
              placeholder="Cari candi, desa adat, pulau, atau ritual..."
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom wave transition ───────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V100H0V40Z"
            className="fill-amber-50"
          />
        </svg>
      </div>
    </section>
  );
}
