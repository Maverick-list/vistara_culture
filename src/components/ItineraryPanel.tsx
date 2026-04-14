"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Sparkles, Map, GripVertical, Trash2, ChevronRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useItinerary, type ItineraryItem } from "@/store/itinerary";
import ItineraryTimeline from "./ItineraryTimeline"; // We will build this next

// ── Root Component ───────────────────────────────────────────────────────

export default function ItineraryPanel() {
  const { state, dispatch, totalDays } = useItinerary();
  const [isGenerating, setIsGenerating] = useState(false);
  const [timelineData, setTimelineData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch({
        type: "REORDER_ITEMS",
        payload: { activeId: active.id as string, overId: over.id as string },
      });
    }
  };

  const handleGenerate = async () => {
    if (state.items.length === 0) return;
    setIsGenerating(true);
    setTimelineData(null); // clear old

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinations: state.items,
          preferences: "Immersive cultural connections, efficient geographical routing.",
        }),
      });

      if (!response.ok) throw new Error("Gagal memproses Itinerary");
      if (!response.body) throw new Error("No stream content");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let rawJsonText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        rawJsonText += decoder.decode(value, { stream: true });
        // Optional tracking progress here if needed
      }

      // Find the JSON block if wrapped in markdown
      const jsonMatch = rawJsonText.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : rawJsonText;
      
      const parsed = JSON.parse(jsonString);
      setTimelineData(parsed);
      dispatch({ type: "TOGGLE_PANEL", payload: false }); // close sidebar to show full timeline
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat memproses Itinerary. Coba ulangi dengan mengurangi jumlah destinasi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* ── Filter / Overlay Timeline ── */}
      <AnimatePresence>
        {timelineData && (
          <ItineraryTimeline
            data={timelineData}
            onClose={() => setTimelineData(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Persistent Floating Action Button (FAB) ── */}
      <AnimatePresence>
        {!state.isOpen && !timelineData && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: "TOGGLE_PANEL" })}
            className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-800 shadow-xl shadow-amber-900/30 text-white transition-colors hover:bg-amber-700 md:bottom-8 md:left-8"
          >
            <Map className="h-6 w-6" />
            {state.items.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-amber-50">
                {state.items.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Sidebar Overlay & Panel ── */}
      <AnimatePresence>
        {state.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => dispatch({ type: "TOGGLE_PANEL", payload: false })}
              className="fixed inset-0 z-50 bg-amber-950/20 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ x: "-100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex w-full flex-col bg-amber-50 shadow-2xl shadow-black/30 sm:w-[450px] border-r border-amber-200/50"
            >
              {/* Header */}
              <header className="flex items-center justify-between border-b border-amber-200 bg-amber-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-800 text-amber-50">
                    <Map className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-amber-950">
                      Rencana Perjalanan
                    </h3>
                    <p className="text-xs text-amber-700">
                      {state.items.length} destinasi • {totalDays} hari
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {state.items.length > 0 && (
                    <button
                      onClick={() => dispatch({ type: "CLEAR" })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-amber-700 transition hover:bg-amber-200/50"
                      title="Hapus Semua"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => dispatch({ type: "TOGGLE_PANEL", payload: false })}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-amber-700 transition hover:bg-amber-200/50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </header>

              {/* Items List (Draggable) */}
              <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                {state.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
                    <Map className="mb-4 h-12 w-12 text-amber-800" />
                    <p className="font-display text-lg font-bold text-amber-900">
                      Itinerary Kosong
                    </p>
                    <p className="mt-1 max-w-[250px] text-sm text-amber-700">
                      Tambahkan destinasi dari halaman utama untuk merencanakan perjalanan budaya Anda.
                    </p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={state.items.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-3">
                        {state.items.map((item, index) => (
                          <SortableItem key={item.id} item={item} index={index + 1} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {/* Footer CTA */}
              <div className="border-t border-amber-200 bg-white p-5">
                <button
                  onClick={handleGenerate}
                  disabled={state.items.length === 0 || isGenerating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4 text-sm font-bold text-white shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-emerald-600/30 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                      />
                      Meracik Itinerary Bersama AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Perjalanan Budaya
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Draggable Item Subcomponent ───────────────────────────────────────────

function SortableItem({ item, index }: { item: ItineraryItem; index: number }) {
  const { dispatch } = useItinerary();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const incrementDurasi = () => {
    if (item.durasi < 5) dispatch({ type: "UPDATE_DURATION", payload: { id: item.id, durasi: item.durasi + 1 } });
  };

  const decrementDurasi = () => {
    if (item.durasi > 1) dispatch({ type: "UPDATE_DURATION", payload: { id: item.id, durasi: item.durasi - 1 } });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex gap-3 rounded-xl border bg-white p-3 shadow-sm transition-colors ${
        isDragging ? "border-amber-400 shadow-md" : "border-amber-200 hover:border-amber-300"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center px-1 text-amber-300 active:cursor-grabbing hover:text-amber-500 transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={item.destination.foto_url[0]}
              alt={item.destination.nama}
              fill
              className="object-cover"
            />
            {/* Number badge */}
            <div className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-800 text-[10px] font-bold text-white border-2 border-white shadow-sm">
              {index}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-display text-sm font-bold leading-tight text-amber-950 line-clamp-1">
              {item.destination.nama}
            </h4>
            <p className="text-[11px] text-amber-700/80 mt-0.5">{item.destination.kategori}</p>
          </div>
          <button
            onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-amber-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-2 py-1 border border-amber-100">
            <Clock className="w-3 h-3 text-amber-600" />
            <button onClick={decrementDurasi} className="text-amber-700 hover:text-amber-900 leading-none pb-0.5">-</button>
            <span className="text-[11px] font-bold w-10 text-center">{item.durasi} {item.durasi === 1 ? 'hari' : 'hari'}</span>
            <button onClick={incrementDurasi} className="text-amber-700 hover:text-amber-900 leading-none pb-0.5">+</button>
          </div>
          <input
            type="text"
            placeholder="Catatan prioritas (opsional)..."
            value={item.catatan}
            onChange={(e) => dispatch({ type: "UPDATE_CATATAN", payload: { id: item.id, catatan: e.target.value } })}
            className="flex-1 bg-transparent text-[11px] placeholder:text-amber-300 text-amber-900 outline-none border-b border-dashed border-amber-200 focus:border-amber-400 py-1"
          />
        </div>
      </div>
    </div>
  );
}
