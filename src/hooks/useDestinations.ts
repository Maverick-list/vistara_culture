"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Destination, Pulau, Kategori } from "@/data/destinations";
import { getDestinationById } from "@/lib/destinations";

// ── Return type ──────────────────────────────────────────────────────────

export interface UseDestinationsReturn {
  /** The full unfiltered list */
  allDestinations: Destination[];
  /** Filtered results based on all active criteria */
  filtered: Destination[];
  /** Current search query */
  searchQuery: string;
  /** Active island filter ("" = all) */
  activePulau: Pulau | "";
  /** Active category filters (multi-select) */
  activeKategori: Kategori[];
  /** Currently selected destination (for modal) */
  selectedDestination: Destination | null;
  /** Whether the modal is open */
  isModalOpen: boolean;
  /** Whether any filter is active */
  hasActiveFilters: boolean;

  // ── Actions ──────────────────────────────────────────────────────────
  /** Set search query (called by SearchBar with debounce already applied) */
  search: (query: string) => void;
  /** Set island filter (single-select, "" to clear) */
  filterByPulau: (pulau: Pulau | "") => void;
  /** Set category filters (multi-select, [] to clear) */
  filterByKategori: (kategori: Kategori[]) => void;
  /** Select a destination and open modal */
  selectDestination: (dest: Destination) => void;
  /** Close modal */
  closeModal: () => void;
  /** Navigate to a different destination while modal stays open */
  navigateModal: (dest: Destination) => void;
  /** Clear all filters and search */
  clearFilters: () => void;
}

// ── Valid values for URL param parsing ────────────────────────────────────

const VALID_PULAU: Pulau[] = [
  "Jawa",
  "Bali",
  "Sumatera",
  "Kalimantan",
  "Sulawesi",
  "Nusa Tenggara",
  "Papua",
  "Maluku",
];

const VALID_KATEGORI: Kategori[] = [
  "Candi & Pura",
  "Alam & Lanskap",
  "Desa Budaya",
  "Situs Sejarah",
  "Upacara & Tradisi",
  "Kuliner Heritage",
];

// ── Hook ─────────────────────────────────────────────────────────────────

export function useDestinations(
  allDestinations: Destination[]
): UseDestinationsReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Initialise state from URL search params ──────────────────────────
  const [searchQuery, setSearchQuery] = useState<string>(
    () => searchParams.get("q") ?? ""
  );

  const [activePulau, setActivePulau] = useState<Pulau | "">(() => {
    const param = searchParams.get("pulau") ?? "";
    return VALID_PULAU.includes(param as Pulau) ? (param as Pulau) : "";
  });

  const [activeKategori, setActiveKategori] = useState<Kategori[]>(() => {
    const param = searchParams.get("kategori") ?? "";
    if (!param) return [];
    return param
      .split(",")
      .filter((k): k is Kategori => VALID_KATEGORI.includes(k as Kategori));
  });

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(() => {
      const id = searchParams.get("dest");
      return id ? getDestinationById(id) ?? null : null;
    });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    () => !!searchParams.get("dest")
  );

  // ── URL sync (write params when state changes) ────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (activePulau) params.set("pulau", activePulau);
    if (activeKategori.length > 0)
      params.set("kategori", activeKategori.join(","));
    if (isModalOpen && selectedDestination)
      params.set("dest", selectedDestination.id);

    const qs = params.toString();
    const target = qs ? `?${qs}` : "/";

    // Replace (not push) so filter changes don't pollute history
    router.replace(target, { scroll: false });
  }, [
    searchQuery,
    activePulau,
    activeKategori,
    selectedDestination,
    isModalOpen,
    router,
  ]);

  // ── Combined filter logic ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let results = allDestinations;

    // Island filter
    if (activePulau) {
      results = results.filter((d) => d.pulau === activePulau);
    }

    // Category filter (multi-select — OR within categories)
    if (activeKategori.length > 0) {
      results = results.filter((d) => activeKategori.includes(d.kategori));
    }

    // Full-text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter((d) => {
        const haystack = [
          d.nama,
          d.lokasi,
          d.provinsi,
          d.pulau,
          d.kategori,
          d.deskripsi_singkat,
          d.konteks_budaya,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    return results;
  }, [allDestinations, activePulau, activeKategori, searchQuery]);

  const hasActiveFilters =
    activePulau !== "" ||
    activeKategori.length > 0 ||
    searchQuery.trim() !== "";

  // ── Actions ───────────────────────────────────────────────────────────

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filterByPulau = useCallback((pulau: Pulau | "") => {
    setActivePulau(pulau);
  }, []);

  const filterByKategori = useCallback((kategori: Kategori[]) => {
    setActiveKategori(kategori);
  }, []);

  const selectDestination = useCallback((dest: Destination) => {
    setSelectedDestination(dest);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Keep selectedDestination so AnimatePresence exit animation can use it
  }, []);

  const navigateModal = useCallback((dest: Destination) => {
    setSelectedDestination(dest);
    // Modal stays open, content transitions to new destination
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setActivePulau("");
    setActiveKategori([]);
  }, []);

  return {
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
  };
}
