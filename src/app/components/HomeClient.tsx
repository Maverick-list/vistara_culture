"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import type { Destination, Pulau, Kategori } from "@/data/destinations";
import { useDestinations } from "@/hooks/useDestinations";
import HeroSection from "@/components/HeroSection";
import DestinationModal from "@/components/DestinationModal";
import FilterPills from "@/components/FilterPills";
import DestinationCard from "@/components/DestinationCard";
import EmptyState from "@/components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import ItineraryPanel from "@/components/ItineraryPanel";
import AzureBadge from "@/components/AzureBadge";
import { ItineraryProvider } from "@/store/itinerary";

// ── Constants ────────────────────────────────────────────────────────────

const PULAU_OPTIONS: Pulau[] = [
  "Jawa",
  "Bali",
  "Sumatera",
  "Kalimantan",
  "Sulawesi",
  "Nusa Tenggara",
  "Papua",
  "Maluku",
];

const KATEGORI_OPTIONS: Kategori[] = [
  "Candi & Pura",
  "Alam & Lanskap",
  "Desa Budaya",
  "Situs Sejarah",
  "Upacara & Tradisi",
  "Kuliner Heritage",
];

// ── Props ────────────────────────────────────────────────────────────────

interface HomeClientProps {
  destinations: Destination[];
}

// ── Inner component (needs useSearchParams, must be inside Suspense) ─────

function HomeContent({ destinations }: HomeClientProps) {
  const {
    allDestinations,
    filtered,
    searchQuery,
    activePulau,
    activeKategori,
    selectedDestination,
    isModalOpen,
    hasActiveFilters,
    search,
    filterByPulau,
    filterByKategori,
    selectDestination,
    closeModal,
    navigateModal,
    clearFilters,
  } = useDestinations(destinations);

  // ── Virtual Scrolling / Lazy Pagination ──────────────────────────────────
  const [visibleCount, setVisibleCount] = useState(20);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filtered.length]);

  // Reset count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [filtered, searchQuery, activePulau, activeKategori]);

  const visibleDestinations = filtered.slice(0, visibleCount);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <HeroSection onSearch={search} />

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="bg-amber-50 pb-20">
        <div className="mx-auto max-w-6xl px-6 pt-12">
          {/* Section header */}
          <div className="mb-10 flex items-end gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                <MapPin className="h-4 w-4" />
                Destinasi Pilihan
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold text-amber-950 md:text-3xl">
                Jendela ke Nusantara
              </h2>
            </div>
          </div>

          {/* ── Filter pills ─────────────────────────────────────── */}
          <div className="mb-8 space-y-5">
            <FilterPills<Pulau>
              label="Pulau"
              options={PULAU_OPTIONS}
              activeFilter={activePulau}
              onFilterChange={(val) => filterByPulau(val as Pulau | "")}
              mode="single"
            />

            <FilterPills<Kategori>
              label="Kategori"
              options={KATEGORI_OPTIONS}
              activeFilter={activeKategori}
              onFilterChange={(val) => filterByKategori(val as Kategori[])}
              mode="multi"
            />
          </div>

          {/* ── Results count ────────────────────────────────────── */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-amber-700/70">
              Menampilkan{" "}
              <span className="font-semibold text-amber-900">
                {filtered.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-amber-900">
                {allDestinations.length}
              </span>{" "}
              destinasi
              {searchQuery.trim() && (
                <>
                  {" "}
                  untuk &quot;
                  <span className="font-medium text-emerald-700">
                    {searchQuery}
                  </span>
                  &quot;
                </>
              )}
            </p>

            {hasActiveFilters && (
              <button
                id="clear-all-filters"
                onClick={clearFilters}
                className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* ── Grid / Empty ──────────────────────────────────────── */}
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {visibleDestinations.map((dest, i) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      onClick={() => selectDestination(dest)}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>
              {filtered.length > visibleCount && (
                <div ref={observerTarget} className="mt-8 flex h-10 w-full items-center justify-center text-sm font-semibold text-amber-500">
                  Memuat destinasi lainnya...
                </div>
              )}
            </>
          ) : (
            <EmptyState
              searchQuery={searchQuery}
              onClearFilters={clearFilters}
            />
          )}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-amber-200 bg-amber-100/50 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-center text-sm text-amber-700/60">
          <p>
            © 2026 NusantaraGuide AI — Memperkenalkan kekayaan budaya Indonesia
            kepada dunia.
          </p>
          <AzureBadge />
        </div>
      </footer>

      <DestinationModal
        destination={selectedDestination}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNavigate={navigateModal}
      />

      {/* ── Floating Fab & Panel ─────────────────────────────────── */}
      <ItineraryPanel />
    </>
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────

function HomeSkeleton() {
  return (
    <>
      <div className="h-[60vh] w-full bg-amber-900/10 animate-pulse" />
      <main className="bg-amber-50 pb-20">
        <div className="mx-auto max-w-6xl px-6 pt-12">
          <div className="mb-10 space-y-4">
            <div className="h-4 w-32 rounded bg-amber-200/60 animate-pulse" />
            <div className="h-8 w-64 rounded bg-amber-200/60 animate-pulse" />
          </div>
          <div className="mb-8 space-y-5">
            <div className="h-10 w-full max-w-2xl rounded-full bg-amber-200/60 animate-pulse" />
            <div className="h-10 w-full max-w-md rounded-full bg-amber-200/60 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <div key={key} className="h-72 w-full rounded-2xl bg-white shadow-sm border border-amber-100 overflow-hidden">
                <div className="h-40 w-full bg-amber-200/50 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-amber-200/50 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-amber-200/50 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

// ── Exported wrapper with Suspense for useSearchParams ───────────────────

export default function HomeClient({ destinations }: HomeClientProps) {
  return (
    <ItineraryProvider>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent destinations={destinations} />
      </Suspense>
    </ItineraryProvider>
  );
}
