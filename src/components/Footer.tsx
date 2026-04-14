"use client";

import Link from "next/link";
import { Github, Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-200/80 pt-16 pb-8 border-t border-amber-900/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block group">
               <h2 className="text-2xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                 NusantaraGuide AI
               </h2>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Jelajahi Jiwa Budaya Nusantara Melalui Lensa Kecerdasan Buatan. 
              Mengenalkan warisan leluhur Indonesia ke panggung dunia.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#" className="p-2 rounded-full bg-amber-900/50 hover:bg-amber-800 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-amber-900/50 hover:bg-amber-800 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Tentang</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">Beranda</Link></li>
              <li><Link href="/destinasi" className="hover:text-amber-400 transition-colors">Destinasi</Link></li>
              <li><Link href="/itinerary" className="hover:text-amber-400 transition-colors">Itinerary</Link></li>
              <li><Link href="/tentang" className="hover:text-amber-400 transition-colors">Visi & Misi</Link></li>
            </ul>
          </div>

          {/* Tech stack badges */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Teknologi</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-900/30 border border-blue-400/20 text-blue-300 text-[10px] font-bold rounded-full">
                NEXT.JS 14
              </span>
              <span className="px-3 py-1 bg-emerald-900/30 border border-emerald-400/20 text-emerald-300 text-[10px] font-bold rounded-full">
                AZURE AI LANGUAGE
              </span>
              <span className="px-3 py-1 bg-amber-900/30 border border-amber-400/20 text-amber-300 text-[10px] font-bold rounded-full">
                GEMINI 1.5 FLASH
              </span>
              <span className="px-3 py-1 bg-purple-900/30 border border-purple-400/20 text-purple-300 text-[10px] font-bold rounded-full">
                FRAMER MOTION
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-amber-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 NusantaraGuide AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> in Indonesia
          </p>
          <div className="flex gap-6">
             <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
             <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
