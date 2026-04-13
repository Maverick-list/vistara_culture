"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Compass,
  Sparkles,
  ChevronRight,
  Calendar,
  Map,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Destination, Kategori } from "@/data/destinations";
import { getRelatedDestinations } from "@/lib/destinations";
import ChatPanel from "@/components/ChatPanel";
import { useItinerary } from "@/store/itinerary";

// ── Category badge colors (shared with DestinationCard) ──────────────────

const KATEGORI_COLORS: Record<Kategori, { bg: string; text: string }> = {
  "Candi & Pura": { bg: "bg-rose-600/90", text: "text-rose-50" },
  "Alam & Lanskap": { bg: "bg-emerald-600/90", text: "text-emerald-50" },
  "Desa Budaya": { bg: "bg-amber-600/90", text: "text-amber-50" },
  "Situs Sejarah": { bg: "bg-sky-600/90", text: "text-sky-50" },
  "Upacara & Tradisi": { bg: "bg-violet-600/90", text: "text-violet-50" },
  "Kuliner Heritage": { bg: "bg-orange-600/90", text: "text-orange-50" },
};

// ── Tab type ─────────────────────────────────────────────────────────────

type TabId = "tentang" | "filosofi" | "tips";

const TABS: { id: TabId; label: string }[] = [
  { id: "tentang", label: "Tentang" },
  { id: "filosofi", label: "Filosofi & Budaya" },
  { id: "tips", label: "Tips Kunjungan" },
];

// ── Animation variants ───────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: { opacity: 0, x: -12, transition: { duration: 0.15 } },
};

// ── Props ────────────────────────────────────────────────────────────────

interface DestinationModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  /** Callback to open a different destination (for related cards) */
  onNavigate?: (destination: Destination) => void;
}

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════

export default function DestinationModal({
  destination,
  isOpen,
  onClose,
  onNavigate,
}: DestinationModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("tentang");
  const [scrollY, setScrollY] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { dispatch, state } = useItinerary();

  // Reset tab when destination changes
  useEffect(() => {
    setActiveTab("tentang");
    setScrollY(0);
    setIsChatOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [destination?.id]);

  // ── ESC key handler ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Lock body scroll when modal is open ────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Parallax on scroll ─────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      setScrollY(contentRef.current.scrollTop);
    }
  }, []);

  if (!destination) return null;

  const related = getRelatedDestinations(destination.id, 3);
  const colors = KATEGORI_COLORS[destination.kategori];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          {/* ── Overlay ───────────────────────────────────────────── */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            id="modal-overlay"
          />

          {/* ── Modal panel ───────────────────────────────────────── */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={destination.nama}
            id="destination-modal"
            className="relative z-10 flex h-full w-full flex-col bg-amber-50 md:my-6 md:h-[calc(100vh-3rem)] md:max-w-5xl md:rounded-2xl md:shadow-2xl md:shadow-black/20 overflow-hidden"
          >
            {/* ── Close button ─────────────────────────────────────── */}
            <button
              onClick={onClose}
              id="modal-close"
              className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50 hover:scale-110"
              aria-label="Tutup modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* ── Scrollable content ───────────────────────────────── */}
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overflow-x-hidden modal-scroll"
            >
              {/* ══════ HERO IMAGE with parallax ══════════════════════ */}
              <div className="relative h-72 w-full overflow-hidden sm:h-80 md:h-96">
                <motion.div
                  style={{ y: -(scrollY * 0.35) }}
                  className="absolute inset-0"
                >
                  <Image
                    src={destination.foto_url[0]}
                    alt={destination.nama}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Text on hero */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  {/* Category badge */}
                  <div
                    className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${colors.bg} ${colors.text}`}
                  >
                    {destination.kategori}
                  </div>

                  <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
                    {destination.nama}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {destination.lokasi}, {destination.provinsi}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {destination.rating}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Compass className="h-4 w-4" />
                      {destination.pulau}
                    </span>
                  </div>
                </div>
              </div>

              {/* ══════ CONTENT BODY ══════════════════════════════════ */}
              <div className="flex flex-col gap-8 p-6 md:flex-row md:gap-10 md:p-8">
                {/* ── LEFT: Main content ────────────────────────────── */}
                <div className="flex-1 min-w-0">
                  {/* Tab navigation */}
                  <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-amber-100/70 p-1 no-scrollbar">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        id={`modal-tab-${tab.id}`}
                        className={`relative whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? "text-amber-950"
                            : "text-amber-700/70 hover:text-amber-900"
                        }`}
                      >
                        {activeTab === tab.id && (
                          <motion.span
                            layoutId="modal-active-tab"
                            className="absolute inset-0 rounded-lg bg-white shadow-sm"
                            style={{ zIndex: -1 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab contents */}
                  <AnimatePresence mode="wait">
                    {activeTab === "tentang" && (
                      <motion.div
                        key="tentang"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <TabTentang destination={destination} />
                      </motion.div>
                    )}

                    {activeTab === "filosofi" && (
                      <motion.div
                        key="filosofi"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <TabFilosofi destination={destination} />
                      </motion.div>
                    )}

                    {activeTab === "tips" && (
                      <motion.div
                        key="tips"
                        variants={tabContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <TabTips destination={destination} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── RIGHT: Sidebar ───────────────────────────────── */}
                <aside className="w-full shrink-0 md:w-72 lg:w-80">
                  {/* Action Buttons */}
                  <div className="mb-6 space-y-3">
                    <button
                      id="ask-ai-button"
                      onClick={() => setIsChatOpen(true)}
                      className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition-all hover:from-emerald-500 hover:to-emerald-600 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Sparkles className="h-5 w-5" />
                      Tanya AI tentang tempat ini
                    </button>

                    <button
                      onClick={() => {
                        dispatch({ type: "ADD_ITEM", payload: { destination } });
                      }}
                      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-800 transition-all hover:bg-amber-100 hover:border-amber-400 active:bg-amber-200"
                    >
                      <Map className="h-4 w-4" />
                      Tambah ke Itinerary
                    </button>
                  </div>

                  {/* Photo gallery */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-700/70">
                      Galeri Foto
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {destination.foto_url.map((url, i) => (
                        <div
                          key={i}
                          className="group relative aspect-square overflow-hidden rounded-xl"
                        >
                          <Image
                            src={url}
                            alt={`${destination.nama} foto ${i + 1}`}
                            fill
                            sizes="120px"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick info */}
                  <div className="mb-6 rounded-xl border border-amber-200/60 bg-white p-4">
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-700/70">
                      Info Singkat
                    </h4>
                    <div className="space-y-3 text-sm">
                      <InfoRow
                        icon={<MapPin className="h-4 w-4 text-amber-500" />}
                        label="Lokasi"
                        value={`${destination.lokasi}, ${destination.provinsi}`}
                      />
                      <InfoRow
                        icon={<Compass className="h-4 w-4 text-amber-500" />}
                        label="Pulau"
                        value={destination.pulau}
                      />
                      <InfoRow
                        icon={<Calendar className="h-4 w-4 text-amber-500" />}
                        label="Waktu Terbaik"
                        value={destination.waktu_terbaik}
                      />
                      <InfoRow
                        icon={
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        }
                        label="Rating"
                        value={`${destination.rating} / 5.0`}
                      />
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="rounded-xl border border-amber-200/60 bg-white p-4">
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-700/70">
                      Koordinat
                    </h4>
                    <p className="font-mono text-xs text-amber-800">
                      {destination.koordinat.lat.toFixed(4)}°,{" "}
                      {destination.koordinat.lng.toFixed(4)}°
                    </p>
                  </div>
                </aside>
              </div>

              {/* ══════ RELATED DESTINATIONS ══════════════════════════ */}
              {related.length > 0 && (
                <div className="border-t border-amber-200/60 bg-amber-100/30 p-6 md:p-8">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-700/70">
                    Destinasi Terkait
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {related.map((rel) => (
                      <RelatedCard
                        key={rel.id}
                        destination={rel}
                        onClick={() => onNavigate?.(rel)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Chat Side Panel ──────────────────────────────────── */}
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            destination={destination}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// TAB: Tentang
// ══════════════════════════════════════════════════════════════════════════

function TabTentang({ destination }: { destination: Destination }) {
  return (
    <div className="space-y-5">
      <p className="text-base leading-relaxed text-amber-900/80">
        {destination.deskripsi_singkat}
      </p>

      <div className="rounded-xl border border-amber-200/50 bg-amber-100/40 p-5">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
          <Clock className="h-4 w-4 text-amber-600" />
          Waktu Terbaik Berkunjung
        </h4>
        <p className="text-sm text-amber-800">{destination.waktu_terbaik}</p>
      </div>

      {/* Rating breakdown visual */}
      <div className="flex items-center gap-4 rounded-xl border border-amber-200/50 bg-white p-5">
        <div className="text-center">
          <p className="text-3xl font-bold text-amber-900">
            {destination.rating}
          </p>
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(destination.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-amber-200"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">Rating Destinasi</p>
          <p className="text-xs text-amber-600">
            Berdasarkan penilaian wisatawan dan pakar budaya
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// TAB: Filosofi & Budaya (magazine-style article)
// ══════════════════════════════════════════════════════════════════════════

function TabFilosofi({ destination }: { destination: Destination }) {
  return (
    <article className="prose-nusantara">
      {/* Konteks Budaya — with drop cap */}
      <div className="mb-8">
        <h4 className="mb-4 font-display text-xl font-bold text-amber-950">
          Konteks Budaya
        </h4>
        <p className="text-base leading-[1.85] text-amber-900/80 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-amber-800">
          {destination.konteks_budaya}
        </p>
      </div>

      {/* Decorative divider */}
      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        <span className="text-lg text-amber-400">✦</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
      </div>

      {/* Filosofi */}
      <div>
        <h4 className="mb-4 font-display text-xl font-bold text-amber-950">
          Makna Filosofis
        </h4>
        <div className="rounded-xl border-l-4 border-amber-600 bg-gradient-to-r from-amber-100/60 to-transparent py-5 pl-6 pr-4">
          <p className="font-display text-base italic leading-[1.85] text-amber-900/85">
            &ldquo;{destination.filosofi}&rdquo;
          </p>
        </div>
      </div>
    </article>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// TAB: Tips Kunjungan
// ══════════════════════════════════════════════════════════════════════════

function TabTips({ destination }: { destination: Destination }) {
  return (
    <div className="space-y-5">
      {/* Tips list */}
      <div className="space-y-3">
        {destination.tips_kunjungan.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3, ease: "easeOut" }}
            className="flex items-start gap-3 rounded-xl bg-white p-4 border border-amber-200/40 shadow-sm"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-sm leading-relaxed text-amber-900/80">{tip}</p>
          </motion.div>
        ))}
      </div>

      {/* Best time highlight */}
      <div className="rounded-xl bg-gradient-to-br from-amber-800 to-amber-900 p-5 text-white">
        <div className="flex items-center gap-2.5 mb-2">
          <Clock className="h-5 w-5 text-amber-300" />
          <h4 className="text-sm font-bold">Waktu Terbaik Berkunjung</h4>
        </div>
        <p className="text-sm text-amber-200/90 leading-relaxed">
          {destination.waktu_terbaik}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SMALL COMPONENTS
// ══════════════════════════════════════════════════════════════════════════

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-amber-500">{label}</p>
        <p className="text-sm font-medium text-amber-900">{value}</p>
      </div>
    </div>
  );
}

function RelatedCard({
  destination,
  onClick,
}: {
  destination: Destination;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      id={`related-card-${destination.id}`}
      className="group flex items-center gap-3 rounded-xl bg-white p-3 text-left border border-amber-200/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={destination.foto_url[0]}
          alt={destination.nama}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h5 className="truncate text-sm font-bold text-amber-950 group-hover:text-amber-800 transition-colors">
          {destination.nama}
        </h5>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-600">
          <MapPin className="h-3 w-3" />
          {destination.lokasi}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-amber-500">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {destination.rating}
          <ChevronRight className="ml-auto h-3.5 w-3.5 text-amber-400 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </button>
  );
}
