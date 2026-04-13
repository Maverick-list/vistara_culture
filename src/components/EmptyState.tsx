"use client";

import { motion } from "framer-motion";

// ── Props ────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  searchQuery?: string;
  onClearFilters: () => void;
}

// ── Component ────────────────────────────────────────────────────────────

export default function EmptyState({
  searchQuery,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-6 py-24 text-center"
      id="empty-state"
    >
      {/* ── SVG Illustration: compass with question mark ──────────── */}
      <div className="relative">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
            aria-hidden="true"
          >
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="url(#emptyGrad)"
              opacity="0.12"
            />
            <circle
              cx="80"
              cy="80"
              r="56"
              fill="url(#emptyGrad)"
              opacity="0.08"
            />

            {/* Compass body */}
            <circle
              cx="80"
              cy="80"
              r="40"
              stroke="#D97706"
              strokeWidth="2.5"
              fill="#FEF3C7"
              opacity="0.9"
            />
            <circle
              cx="80"
              cy="80"
              r="32"
              stroke="#D97706"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />

            {/* Compass needle */}
            <polygon
              points="80,52 76,80 80,84 84,80"
              fill="#DC2626"
              opacity="0.8"
            />
            <polygon
              points="80,108 76,80 80,76 84,80"
              fill="#9CA3AF"
              opacity="0.6"
            />

            {/* Center dot */}
            <circle cx="80" cy="80" r="4" fill="#D97706" />

            {/* Cardinal markers */}
            <text
              x="80"
              y="48"
              textAnchor="middle"
              fill="#B45309"
              fontSize="9"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              N
            </text>
            <text
              x="80"
              y="118"
              textAnchor="middle"
              fill="#B45309"
              fontSize="9"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              S
            </text>
            <text
              x="116"
              y="84"
              textAnchor="middle"
              fill="#B45309"
              fontSize="9"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              E
            </text>
            <text
              x="44"
              y="84"
              textAnchor="middle"
              fill="#B45309"
              fontSize="9"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              W
            </text>

            {/* Question mark overlay */}
            <circle
              cx="120"
              cy="36"
              r="18"
              fill="#FEF3C7"
              stroke="#D97706"
              strokeWidth="2"
            />
            <text
              x="120"
              y="42"
              textAnchor="middle"
              fill="#D97706"
              fontSize="18"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              ?
            </text>

            {/* Decorative dots */}
            <circle cx="30" cy="130" r="3" fill="#D97706" opacity="0.15" />
            <circle cx="140" cy="140" r="4" fill="#D97706" opacity="0.1" />
            <circle cx="20" cy="60" r="2" fill="#D97706" opacity="0.2" />

            <defs>
              <radialGradient
                id="emptyGrad"
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Floating particles */}
        <motion.div
          animate={{ y: [-4, 4, -4], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-2 -right-2 h-2 w-2 rounded-full bg-amber-400"
        />
        <motion.div
          animate={{ y: [4, -4, 4], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute bottom-4 -left-4 h-3 w-3 rounded-full bg-amber-300"
        />
      </div>

      {/* ── Text ──────────────────────────────────────────────────── */}
      <div className="max-w-sm">
        <h3 className="font-display text-xl font-bold text-amber-900">
          Destinasi Tidak Ditemukan
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-amber-700/70">
          {searchQuery?.trim() ? (
            <>
              Pencarian &quot;
              <span className="font-medium text-amber-800">{searchQuery}</span>
              &quot; tidak cocok dengan destinasi manapun. Coba kata kunci lain
              atau reset filter.
            </>
          ) : (
            <>
              Tidak ada destinasi yang cocok dengan filter yang dipilih. Coba
              kombinasi filter yang berbeda atau reset semua filter.
            </>
          )}
        </p>
      </div>

      {/* ── Action ────────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClearFilters}
        id="empty-state-reset"
        className="rounded-xl bg-amber-800 px-6 py-3 text-sm font-bold text-white shadow-md shadow-amber-800/20 transition-colors hover:bg-amber-700"
      >
        Reset Semua Filter
      </motion.button>
    </motion.div>
  );
}
