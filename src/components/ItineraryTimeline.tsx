"use client";

import { motion } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, MapPin, CheckCircle, Share2, Download } from "lucide-react";
import type { Destination } from "@/data/destinations";

interface TimelineProps {
  data: any;
  onClose: () => void;
}

export default function ItineraryTimeline({ data, onClose }: TimelineProps) {
  // If parsing failed or we have a literal partial string, gracefully handle it
  const isString = typeof data === "string";

  const handleCopyLink = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    window.location.hash = encoded;
    alert("Tautan tersalin ke URL Hash! Anda bisa membagikannya sekarang.");
  };

  const handleDownload = () => {
    const textBlob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain" });
    const url = URL.createObjectURL(textBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nusantara-itinerary.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-center bg-amber-50/95 backdrop-blur-sm overflow-y-auto print:bg-white print:block"
    >
      <div className="relative w-full max-w-4xl bg-white min-h-screen shadow-2xl print:shadow-none print:max-w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-200 bg-amber-50/95 backdrop-blur px-8 py-5 print:relative print:border-none print:px-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-amber-950">
              {data.judul || "Itinerary Budaya Nusantara"}
            </h2>
            <p className="text-sm text-amber-700/80 mt-1 max-w-xl">
              {data.narasi || "Rangkuman perjalanan budaya Anda yang diracik khusus untuk menyatukan nilai-nilai sejarah dan filosofi Nusantara."}
            </p>
          </div>
          <div className="flex gap-2 print:hidden items-start">
            <button
              onClick={handleCopyLink}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white border border-amber-200 text-amber-700 transition hover:bg-amber-100 hover:text-amber-900 shadow-sm"
              title="Bagikan Tautan"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDownload}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white border border-amber-200 text-amber-700 transition hover:bg-amber-100 hover:text-amber-900 shadow-sm"
              title="Unduh (.json)"
            >
              <Download className="h-4 w-4" />
            </button>
            <div className="w-px h-10 bg-amber-200 mx-1"></div>
            <button
              onClick={onClose}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800 transition hover:bg-amber-200 hover:text-amber-950"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 pb-24 print:p-0">
          {isString ? (
            <div className="prose prose-amber max-w-none text-sm whitespace-pre-wrap">
              {data}
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {/* Cost Est */}
              {data.estimasi_biaya && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 print:border-none print:bg-transparent print:p-0">
                  <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Estimasi Biaya</h4>
                  <p className="text-emerald-950 font-medium">{data.estimasi_biaya}</p>
                </div>
              )}

              {/* Timeline Items */}
              <div className="relative border-l-2 border-amber-200 ml-4 space-y-12 pb-10 print:border-none print:ml-0">
                {data.hari?.map((day: any, i: number) => (
                  <div key={i} className="relative pl-8 print:pl-0">
                    {/* Day Dot */}
                    <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 border-4 border-white shadow-sm print:hidden">
                      <CalendarIcon className="h-3 w-3 text-amber-700" />
                    </div>

                    <div className="mb-6">
                      <h3 className="font-display text-xl font-bold text-amber-900">
                        Hari Ke-{day.hari}: {day.tema}
                      </h3>
                      {day.transisi && (
                        <p className="text-[13px] text-amber-700 italic border-l-2 border-amber-400 pl-3 mt-2">
                          💡 Tips Perjalanan: {day.transisi}
                        </p>
                      )}
                    </div>

                    <div className="space-y-6">
                      {day.aktivitas?.map((act: any, j: number) => (
                        <div key={j} className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-amber-300 print:shadow-none print:border-none print:p-0 print:border-b print:rounded-none print:pb-4">
                          
                          {/* Time */}
                          <div className="flex shrink-0 items-start gap-2 sm:w-24 text-amber-600">
                            <Clock className="w-4 h-4 mt-0.5" />
                            <span className="text-sm font-bold">{act.waktu}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-amber-950 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                              {act.tempat}
                            </h4>
                            <p className="text-sm text-amber-800/80 mt-2 leading-relaxed">
                              {act.deskripsi}
                            </p>
                            {act.makna_budaya && (
                              <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 border border-amber-100/50 print:bg-transparent print:border-none print:p-0 print:mt-1">
                                <span className="font-bold">Makna:</span> {act.makna_budaya}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
