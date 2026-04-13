"use client";

import { useState, useMemo, useCallback } from "react";
import { MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Destination, Pulau, Kategori } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import FilterPills from "@/components/FilterPills";

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

interface DestinationExplorerProps {
  destinations: Destination[];
  /** External search query from HeroSection's SearchBar */
  searchQuery?: string;
  /** Callback when a card is clicked (opens modal) */
  onDestinationClick?: (destination: Destination) => void;
}

// ── Main Client Component ────────────────────────────────────────────────

export default function DestinationExplorer({
  destinations,
  searchQuery = "",
  onDestinationClick,
}: DestinationExplorerProps) {
  const [selectedPulau, setSelectedPulau] = useState<Pulau | "">("");
  const [selectedKategori, setSelectedKategori] = useState<Kategori[]>([]);

  // Client-side filtering for instant responsiveness
  const filtered = useMemo(() => {
    let results = destinations;

    if (selectedPulau) {
      results = results.filter((d) => d.pulau === selectedPulau);
    }
    if (selectedKategori.length > 0) {
      results = results.filter((d) => selectedKategori.includes(d.kategori));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter((d) =>
        [d.nama, d.lokasi, d.provinsi, d.pulau, d.kategori, d.deskripsi_singkat]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    return results;
  }, [destinations, searchQuery, selectedPulau, selectedKategori]);

  const handleCardClick = useCallback((dest: Destination) => {
    onDestinationClick?.(dest);
  }, [onDestinationClick]);

  const hasFilters =
    selectedPulau !== "" ||
    selectedKategori.length > 0 ||
    searchQuery.trim() !== "";

  return (
    <section id="explorer" className="w-full">
      {/* ── Filter pills ─────────────────────────────────────────── */}
      <div className="mb-8 space-y-5">
        <FilterPills<Pulau>
          label="Pulau"
          options={PULAU_OPTIONS}
          activeFilter={selectedPulau}
          onFilterChange={(val) => setSelectedPulau(val as Pulau | "")}
          mode="single"
        />

        <FilterPills<Kategori>
          label="Kategori"
          options={KATEGORI_OPTIONS}
          activeFilter={selectedKategori}
          onFilterChange={(val) => setSelectedKategori(val as Kategori[])}
          mode="multi"
        />
      </div>

      {/* ── Results count ────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-amber-700/70">
          Menampilkan{" "}
          <span className="font-semibold text-amber-900">{filtered.length}</span>{" "}
          destinasi
          {searchQuery.trim() && (
            <>
              {" "}
              untuk &quot;
              <span className="font-medium text-emerald-700">{searchQuery}</span>
              &quot;
            </>
          )}
        </p>

        {hasFilters && (
          <button
            id="clear-all-filters"
            onClick={() => {
              setSelectedPulau("");
              setSelectedKategori([]);
            }}
            className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((dest, i) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onClick={() => handleCardClick(dest)}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-20 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Search className="h-7 w-7 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-semibold text-amber-900">
              Tidak ada destinasi ditemukan
            </p>
            <p className="mt-1 text-sm text-amber-600">
              Coba ubah kata kunci atau reset filter
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
