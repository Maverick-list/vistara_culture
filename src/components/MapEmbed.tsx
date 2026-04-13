"use client";

import { useState } from "react";
import { Map, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface MapEmbedProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapEmbed({ lat, lng, name }: MapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Fallback URL directly to Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-amber-200/50 bg-amber-100/30">
      {!isLoaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-200/50 text-amber-700">
            <Map className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-amber-900">Peta Interaktif</p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsLoaded(true)}
              className="rounded-lg bg-amber-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-900"
            >
              Muat Peta
            </button>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-50"
            >
              Buka <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
            title={`Peta ${name}`}
          />
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded bg-white/90 px-3 py-1.5 text-[10px] font-bold text-amber-900 shadow backdrop-blur transition hover:bg-white"
          >
            Buka di Google Maps <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
      )}
    </div>
  );
}
