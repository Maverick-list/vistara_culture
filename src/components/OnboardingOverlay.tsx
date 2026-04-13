"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, MessageCircle, CalendarDays, ChevronRight } from "lucide-react";

export default function OnboardingOverlay() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show if it's explicitly their first time
    const onboarded = localStorage.getItem("hasOnboarded") === "true";
    if (!onboarded) {
      setShow(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 2) {
      setStep((p) => p + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem("hasOnboarded", "true");
    setShow(false);
  };

  if (!show) return null;

  const SLIDES = [
    {
      icon: <Map className="h-24 w-24 text-amber-600" strokeWidth={1} />,
      title: "Temukan 500+ Destinasi Budaya",
      desc: "Jelajahi peta interaktif yang memetakan kekayaan Nusantara dari candi hingga desa adat tersembunyi.",
    },
    {
      icon: <MessageCircle className="h-24 w-24 text-emerald-600" strokeWidth={1} />,
      title: "Pahami Jiwa di Balik Setiap Tempat",
      desc: "Tanya AI kami tentang filosofi, mitologi, hingga sejarah di balik ornamen yang Anda lihat.",
    },
    {
      icon: <CalendarDays className="h-24 w-24 text-rose-600" strokeWidth={1} />,
      title: "Buat Itinerary Personalmu",
      desc: "Susun destinasi impianmu dan biarkan AI meracik narasi perjalanan yang sempurna untukmu.",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-amber-950/40 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-amber-50 shadow-2xl"
        >
          {/* Progress Bar */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-amber-200">
            <motion.div
              className="h-full bg-amber-600"
              initial={{ width: "33%" }}
              animate={{ width: `${((step + 1) / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-10 text-center">
            {/* Skip Button */}
            <button
              onClick={completeOnboarding}
              className="absolute right-5 top-5 text-sm font-medium text-amber-500 hover:text-amber-800"
            >
              Skip
            </button>

            {/* Slide Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <div className="mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-white shadow-inner">
                  {SLIDES[step].icon}
                </div>
                <h2 className="font-display text-2xl font-bold text-amber-950">
                  {SLIDES[step].title}
                </h2>
                <p className="mt-4 text-amber-700/80 leading-relaxed">
                  {SLIDES[step].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === step ? "w-6 bg-amber-600" : "w-2 bg-amber-200"
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-amber-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-amber-800"
              >
                {step === 2 ? "Mulai Eksplorasi" : "Selanjutnya"}
                {step !== 2 && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
