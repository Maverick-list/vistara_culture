"use client";

import { motion } from "framer-motion";

// ── Props ────────────────────────────────────────────────────────────────

interface FilterPillsProps<T extends string> {
  /** Label displayed above the pills */
  label: string;
  /** Array of option values */
  options: T[];
  /** Currently active filter(s) — string for single-select, string[] for multi-select */
  activeFilter: T | T[] | "";
  /** Callback when a filter is toggled */
  onFilterChange: (value: T | T[]) => void;
  /** Selection mode */
  mode?: "single" | "multi";
  /** Show "Semua" option for single-select */
  showAll?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────

export default function FilterPills<T extends string>({
  label,
  options,
  activeFilter,
  onFilterChange,
  mode = "single",
  showAll = true,
}: FilterPillsProps<T>) {
  const isActive = (option: T): boolean => {
    if (Array.isArray(activeFilter)) {
      return activeFilter.includes(option);
    }
    return activeFilter === option;
  };

  const isAllActive = (): boolean => {
    if (mode === "single") {
      return activeFilter === "" || activeFilter === undefined;
    }
    return Array.isArray(activeFilter) && activeFilter.length === 0;
  };

  const handleClick = (option: T) => {
    if (mode === "multi") {
      // Multi-select: toggle individual options
      const current = Array.isArray(activeFilter) ? activeFilter : [];
      if (current.includes(option)) {
        onFilterChange(current.filter((v) => v !== option) as T[]);
      } else {
        onFilterChange([...current, option] as T[]);
      }
    } else {
      // Single-select: toggle on/off
      if (activeFilter === option) {
        onFilterChange("" as T);
      } else {
        onFilterChange(option);
      }
    }
  };

  const handleAllClick = () => {
    if (mode === "multi") {
      onFilterChange([] as unknown as T[]);
    } else {
      onFilterChange("" as T);
    }
  };

  return (
    <div id={`filter-pills-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-amber-700/80">
        {label}
      </p>

      <div className="flex flex-wrap gap-2">
        {/* "Semua" pill */}
        {showAll && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAllClick}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isAllActive()
                ? "bg-amber-800 text-white shadow-md shadow-amber-800/20"
                : "bg-amber-100/80 text-amber-700 hover:bg-amber-200/80"
            }`}
          >
            {/* Active indicator dot */}
            {isAllActive() && (
              <motion.span
                layoutId={`pill-indicator-${label}`}
                className="absolute inset-0 rounded-full bg-amber-800"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            Semua
          </motion.button>
        )}

        {/* Option pills */}
        {options.map((option) => {
          const active = isActive(option);

          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(option)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-amber-800 text-white shadow-md shadow-amber-800/20"
                  : "bg-amber-100/80 text-amber-700 hover:bg-amber-200/80 hover:text-amber-900"
              }`}
            >
              {/* Animated background for active state */}
              {active && (
                <motion.span
                  layoutId={mode === "single" ? `pill-indicator-${label}` : undefined}
                  className="absolute inset-0 rounded-full bg-amber-800"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
