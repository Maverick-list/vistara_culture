import {
  destinations,
  type Destination,
  type Pulau,
  type Kategori,
} from "@/data/destinations";

/**
 * Returns the complete list of destinations.
 */
export function getAllDestinations(): Destination[] {
  return destinations;
}

/**
 * Finds a single destination by its unique `id`.
 * Returns `undefined` when no match is found.
 */
export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

/**
 * Full-text + faceted filter.
 *
 * - `query`    — free-text search across nama, lokasi, provinsi, deskripsi_singkat, konteks_budaya
 * - `pulau`    — optional island filter
 * - `kategori` — optional category filter
 *
 * All three filters are combined with AND logic.
 * An empty/undefined query matches everything.
 */
export function filterDestinations(
  query?: string,
  pulau?: Pulau,
  kategori?: Kategori
): Destination[] {
  let results = destinations;

  // ── Island filter ──────────────────────────────────────────────────
  if (pulau) {
    results = results.filter((d) => d.pulau === pulau);
  }

  // ── Category filter ────────────────────────────────────────────────
  if (kategori) {
    results = results.filter((d) => d.kategori === kategori);
  }

  // ── Free-text search ───────────────────────────────────────────────
  if (query && query.trim().length > 0) {
    const q = query.toLowerCase().trim();
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
}

/**
 * Returns destinations related to the given `id`.
 *
 * Scoring priority:
 *   1. Same kategori  (+2)
 *   2. Same pulau     (+1)
 *
 * Results are sorted descending by score, then by rating.
 * The source destination itself is excluded.
 */
export function getRelatedDestinations(
  id: string,
  limit: number = 3
): Destination[] {
  const source = getDestinationById(id);
  if (!source) return [];

  const scored = destinations
    .filter((d) => d.id !== id)
    .map((d) => {
      let score = 0;
      if (d.kategori === source.kategori) score += 2;
      if (d.pulau === source.pulau) score += 1;
      return { destination: d, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.destination.rating - a.destination.rating;
    });

  return scored.slice(0, limit).map((s) => s.destination);
}
