"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { Destination } from "@/data/destinations";

// ── Types ────────────────────────────────────────────────────────────────

export interface ItineraryItem {
  id: string; // Unique ID for draggability (can be dest.id if only 1 allowed, or custom uuid if multiple of same place allowed. Let's use dest.id for simplicity + strict Set)
  destination: Destination;
  durasi: number; // in hours or days. Let's say days: 1, 2, or 3
  catatan: string;
}

export interface ItineraryState {
  items: ItineraryItem[];
  isOpen: boolean;
}

export type ItineraryAction =
  | { type: "LOAD_STATE"; payload: ItineraryItem[] }
  | { type: "TOGGLE_PANEL"; payload?: boolean }
  | { type: "ADD_ITEM"; payload: { destination: Destination } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "REORDER_ITEMS"; payload: { activeId: string; overId: string } }
  | { type: "UPDATE_DURATION"; payload: { id: string; durasi: number } }
  | { type: "UPDATE_CATATAN"; payload: { id: string; catatan: string } }
  | { type: "CLEAR" };

// ── Reducer ──────────────────────────────────────────────────────────────

const initialState: ItineraryState = {
  items: [],
  isOpen: false,
};

function itineraryReducer(
  state: ItineraryState,
  action: ItineraryAction
): ItineraryState {
  switch (action.type) {
    case "LOAD_STATE":
      return { ...state, items: action.payload };

    case "TOGGLE_PANEL":
      return { ...state, isOpen: action.payload ?? !state.isOpen };

    case "ADD_ITEM": {
      // Prevent duplicates by ID
      if (state.items.some((i) => i.id === action.payload.destination.id)) {
        return state;
      }
      const newItem: ItineraryItem = {
        id: action.payload.destination.id,
        destination: action.payload.destination,
        durasi: 1,
        catatan: "",
      };
      return { ...state, items: [...state.items, newItem], isOpen: true }; // auto open panel when adding
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    case "REORDER_ITEMS": {
      const { activeId, overId } = action.payload;
      if (activeId === overId) return state;

      const oldIndex = state.items.findIndex((i) => i.id === activeId);
      const newIndex = state.items.findIndex((i) => i.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const newItems = [...state.items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      return { ...state, items: newItems };
    }

    case "UPDATE_DURATION":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, durasi: action.payload.durasi } : i
        ),
      };

    case "UPDATE_CATATAN":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, catatan: action.payload.catatan }
            : i
        ),
      };

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ── Context Provider ─────────────────────────────────────────────────────

interface ItineraryContextValue {
  state: ItineraryState;
  dispatch: React.Dispatch<ItineraryAction>;
  totalDays: number;
}

const ItineraryContext = createContext<ItineraryContextValue | null>(null);

const STORAGE_KEY = "nusantara_itinerary_v1";

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: "LOAD_STATE", payload: JSON.parse(saved) });
      }
    } catch (error) {
      console.error("Failed to parse itinerary from localStorage", error);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    // Only save if it's been initialized/modified, and not just the default empty array immediately
    // Since LOAD_STATE fires initially, it will also trigger this, which is fine.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to save itinerary to localStorage", error);
    }
  }, [state.items]);

  const totalDays = state.items.reduce((sum, item) => sum + item.durasi, 0);

  return (
    <ItineraryContext.Provider value={{ state, dispatch, totalDays }}>
      {children}
    </ItineraryContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error("useItinerary must be used within an ItineraryProvider");
  }
  return context;
}
