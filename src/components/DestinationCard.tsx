"use client";

import Image from "next/image";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Destination, Kategori } from "@/data/destinations";

// ── Per-category color mapping ───────────────────────────────────────────

const KATEGORI_COLORS: Record<Kategori, { bg: string; text: string }> = {
  "Candi & Pura": {
    bg: "bg-rose-600/90",
    text: "text-rose-50",
  },
  "Alam & Lanskap": {
    bg: "bg-emerald-600/90",
    text: "text-emerald-50",
  },
  "Desa Budaya": {
    bg: "bg-amber-600/90",
    text: "text-amber-50",
  },
  "Situs Sejarah": {
    bg: "bg-sky-600/90",
    text: "text-sky-50",
  },
  "Upacara & Tradisi": {
    bg: "bg-violet-600/90",
    text: "text-violet-50",
  },
  "Kuliner Heritage": {
    bg: "bg-orange-600/90",
    text: "text-orange-50",
  },
};

// ── Card animation variants ──────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const overlayVariants = {
  rest: { opacity: 0, y: 12 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

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

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.25, ease: "easeOut" as const },
      }}
      layout
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      id={`destination-card-${destination.id}`}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-amber-900/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      {/* ── Image ──────────────────────────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={destination.foto_url[0]}
          alt={destination.nama}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Rating badge — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {destination.rating}
        </div>

        {/* Category badge — bottom left */}
        <div
          className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${colors.bg} ${colors.text}`}
        >
          {destination.kategori}
        </div>

        {/* "Lihat Detail" hover overlay */}
        <motion.div
          variants={overlayVariants}
          initial="rest"
          whileHover="hover"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="rounded-full bg-white/90 px-5 py-2.5 shadow-lg backdrop-blur-sm">
            <span className="flex items-center gap-2 text-sm font-bold text-amber-900">
              Lihat Detail
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="text-lg font-bold leading-snug text-amber-950 transition-colors group-hover:text-amber-800">
          {destination.nama}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-amber-700/80">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
          <span>
            {destination.lokasi}, {destination.provinsi}
          </span>
        </div>

        <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-amber-900/65">
          {destination.deskripsi_singkat}
        </p>

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-amber-100">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/80 px-2 py-0.5 text-xs font-medium text-amber-800">
            🏝️ {destination.pulau}
          </span>
          <span className="text-xs text-amber-500">{destination.waktu_terbaik}</span>
        </div>
      </div>
    </motion.article>
  );
}
