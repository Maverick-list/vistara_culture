import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  Compass,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { getAllDestinations, getDestinationById } from "@/lib/destinations";
import { getRelatedDestinations } from "@/lib/destinations";
import ShareButton from "@/components/ShareButton";
import MapEmbed from "@/components/MapEmbed";

// ── Params ───────────────────────────────────────────────────────────────

interface DestinasiPageProps {
  params: { id: string };
}

// ── SSG Setup ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllDestinations().map((d) => ({
    id: d.id,
  }));
}

export function generateMetadata({ params }: DestinasiPageProps): Metadata {
  const dest = getDestinationById(params.id);
  if (!dest) return {};

  return {
    title: `${dest.nama} - Destinasi Budaya Indonesia`,
    description: dest.deskripsi_singkat,
    openGraph: {
      title: dest.nama,
      description: dest.deskripsi_singkat,
      images: [dest.foto_url[0]],
    },
  };
}

// ── Helper ───────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-amber-500">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-amber-500">{label}</p>
        <p className="text-sm font-medium text-amber-900">{value}</p>
      </div>
    </div>
  );
}

// ── Page Component ───────────────────────────────────────────────────────

export default function DestinasiPage({ params }: DestinasiPageProps) {
  const dest = getDestinationById(params.id);

  if (!dest) {
    notFound();
  }

  const related = getRelatedDestinations(dest.id, 3);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nusantaraguide.id";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: dest.nama,
    description: dest.deskripsi_singkat,
    image: dest.foto_url,
    publicAccess: true,
    geo: {
      "@type": "GeoCoordinates",
      latitude: dest.koordinat.lat,
      longitude: dest.koordinat.lng,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: dest.lokasi,
      addressRegion: dest.provinsi,
      addressCountry: "ID",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: dest.rating,
      bestRating: "5",
      ratingCount: "128", // Dummy default
    },
  };

  return (
    <main className="min-h-screen bg-amber-50 pb-20">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-amber-900">
        <Image
          src={dest.foto_url[0]}
          alt={dest.nama}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content over hero */}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-6 pb-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-amber-200">
            <Link href="/" className="hover:text-white transition">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-amber-100">Destinasi</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{dest.nama}</span>
          </nav>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-amber-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {dest.kategori}
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                {dest.nama}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  {dest.lokasi}, {dest.provinsi}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Compass className="h-4 w-4 text-amber-400" />
                  {dest.pulau}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {dest.rating}
                </span>
              </div>
            </div>
            
            <div className="flex shrink-0 items-center justify-end">
               <ShareButton 
                title={dest.nama} 
                text={`Jelajahi ${dest.nama} di NusantaraGuide AI`} 
                url={`${baseUrl}/destinasi/${dest.id}`}
                className="rounded-xl border border-white/20 bg-black/40 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-black/60"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-12 md:pt-16">
        <div className="flex flex-col gap-10 md:flex-row lg:gap-16">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-12">
            
            {/* Tentang */}
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold text-amber-950">Tentang Destinasi</h2>
              <p className="text-base leading-relaxed text-amber-900/85">
                {dest.deskripsi_singkat}
              </p>
            </section>

            {/* Konteks Budaya */}
            <section className="prose-nusantara">
              <h2 className="mb-4 font-display text-2xl font-bold text-amber-950">Konteks Sejarah & Budaya</h2>
              <p className="text-base leading-[1.85] text-amber-900/85 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-5xl first-letter:font-bold first-letter:text-amber-800">
                {dest.konteks_budaya}
              </p>
            </section>

            {/* Filosofi */}
            <section>
              <h2 className="mb-4 font-display text-2xl font-bold text-amber-950">Makna Filosofis</h2>
              <div className="rounded-2xl border-l-4 border-amber-600 bg-gradient-to-r from-amber-100/60 to-transparent py-6 pl-8 pr-6">
                <p className="font-display text-lg italic leading-[1.85] text-amber-900/90 text-balance">
                  &ldquo;{dest.filosofi}&rdquo;
                </p>
              </div>
            </section>

            {/* Tips Pilihan */}
            <section>
              <h2 className="mb-5 font-display text-2xl font-bold text-amber-950">Tips Kunjungan</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {dest.tips_kunjungan.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 border border-amber-200/60 shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <p className="text-sm leading-relaxed text-amber-900/80">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Peta Interaktif */}
            <section>
               <h2 className="mb-5 font-display text-2xl font-bold text-amber-950">Lokasi Peta</h2>
               <MapEmbed lat={dest.koordinat.lat} lng={dest.koordinat.lng} name={dest.nama} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-80 space-y-8">
            <div className="rounded-2xl border border-amber-200/60 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-display text-lg font-bold text-amber-950">Informasi Penting</h3>
              <div className="space-y-4">
                <InfoRow icon={<MapPin className="h-5 w-5" />} label="Lokasi" value={`${dest.lokasi}, ${dest.provinsi}`} />
                <InfoRow icon={<Compass className="h-5 w-5" />} label="Pulau" value={dest.pulau} />
                <InfoRow icon={<Calendar className="h-5 w-5" />} label="Waktu Terbaik" value={dest.waktu_terbaik} />
                <InfoRow icon={<Clock className="h-5 w-5" />} label="Rekomendasi Durasi" value="1 - 2 Hari" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-amber-950">Galeri Foto</h3>
              <div className="grid grid-cols-2 gap-3">
                {dest.foto_url.map((url, i) => (
                  <div key={i} className={`relative aspect-square overflow-hidden rounded-xl bg-amber-100 ${i === 0 ? "col-span-2 aspect-[2/1]" : ""}`}>
                    <Image
                      src={url}
                      alt={`${dest.nama} foto ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 300px"
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Explore More Recommendations */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-amber-200 pt-16">
            <div className="mb-8 flex items-center justify-between">
               <h2 className="font-display text-2xl font-bold text-amber-950">Jelajahi Lebih Lanjut</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
               {related.map((rel) => (
                 <Link href={`/destinasi/${rel.id}`} key={rel.id} className="group relative flex h-64 shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-amber-900 border border-amber-200/50">
                    <Image
                      src={rel.foto_url[0]}
                      alt={rel.nama}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover opacity-80 mix-blend-overlay transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="relative p-5">
                      <p className="mb-1 text-xs font-semibold text-amber-300">{rel.kategori}</p>
                      <h3 className="font-display text-lg font-bold text-white">{rel.nama}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
                        <MapPin className="h-3 w-3" /> {rel.lokasi}
                      </p>
                    </div>
                 </Link>
               ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
