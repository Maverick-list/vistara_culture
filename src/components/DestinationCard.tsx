"use client";

import Image from "next/image";
import { MapPin, Star, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Destination, Kategori } from "@/data/destinations";

// ── Per-category gradient mapping ───────────────────────────────────────

const KATEGORI_GRADIENTS: Record<Kategori, string> = {
  "Candi & Pura": "from-rose-600/60 to-transparent",
  "Alam & Lanskap": "from-emerald-600/60 to-transparent",
  "Desa Budaya": "from-amber-600/60 to-transparent",
  "Situs Sejarah": "from-sky-600/60 to-transparent",
  "Upacara & Tradisi": "from-violet-600/60 to-transparent",
  "Kuliner Heritage": "from-orange-600/60 to-transparent",
};

const KATEGORI_COLORS: Record<Kategori, { bg: string; text: string }> = {
  "Candi & Pura": { bg: "bg-rose-600", text: "text-rose-50" },
  "Alam & Lanskap": { bg: "bg-emerald-600", text: "text-emerald-50" },
  "Desa Budaya": { bg: "bg-amber-600", text: "text-amber-50" },
  "Situs Sejarah": { bg: "bg-sky-600", text: "text-sky-50" },
  "Upacara & Tradisi": { bg: "bg-violet-600", text: "text-violet-50" },
  "Kuliner Heritage": { bg: "bg-orange-600", text: "text-orange-50" },
};

// Top 3 destinations based on data (4.9 ratings)
const POPULAR_IDS = ["borobudur", "raja-ampat", "wae-rebo"];

// ── Card animation variants ──────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

// ── Image Shimmer Animation ──────────────────────────────────────────────

const Shimmer = () => (
  <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: "100%" }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent"
  />
);

// ── Props ────────────────────────────────────────────────────────────────

interface DestinationCardProps {
  destination: Destination;
  onClick: () => void;
  index?: number;
}

// ── Component ────────────────────────────────────────────────────────────

export default function DestinationCard({
  destination,
  onClick,
  index = 0,
}: DestinationCardProps) {
  const colors = KATEGORI_COLORS[destination.kategori];
  const gradient = KATEGORI_GRADIENTS[destination.kategori];
  const isPopular = POPULAR_IDS.includes(destination.id);

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      layout
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-amber-200/50 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10 focus-within:ring-2 focus-within:ring-amber-500"
    >
      {/* Tooltip on Hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none px-3 py-2 bg-amber-900 text-white text-[10px] rounded-lg shadow-xl w-48 text-center line-clamp-2">
        {destination.konteks_budaya}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-amber-900" />
      </div>

      {/* ── Image ──────────────────────────────────────────────────── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-amber-100">
        <Shimmer />
        
        <Image
          src={destination.foto_url[0]}
          alt={destination.nama}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80"; // Fallback to Borobudur
          }}
        />

        {/* Dynamic Gradient based on category */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-80`} />

        {/* Populer Badge */}
        {isPopular && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-lg">
            <Sparkles className="h-3 w-3" />
            Populer
          </div>
        )}

        {/* Rating badge — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {destination.rating}
        </div>

        {/* Category badge — bottom left */}
        <div
          className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${colors.bg} ${colors.text}`}
        >
          {destination.kategori}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600">
          <MapPin className="h-3 w-3" />
          {destination.lokasi}
        </div>

        <h3 className="text-xl font-bold leading-tight text-amber-950 transition-colors group-hover:text-amber-800">
          {destination.nama}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-amber-900/60">
          {destination.deskripsi_singkat}
        </p>

        {/* Action / Detail indicator */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-amber-100">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-900">
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            EKSPLORASI
          </div>
          <span className="text-[10px] font-medium text-amber-500 uppercase tracking-tighter">
            {destination.pulau}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
