import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import ErrorBoundary from "@/components/ErrorBoundary";
import DemoBanner from "@/components/DemoBanner";
import OnboardingOverlay from "@/components/OnboardingOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#fbf6f0", // amber-50
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 60,40 90,50 60,60 50,90 40,60 10,50 40,40" fill="%23d97706"/><circle cx="50" cy="50" r="15" fill="%23fef3c7"/></svg>`;

export const metadata: Metadata = {
  title: "NusantaraGuide AI — Jelajahi Jiwa Budaya Nusantara",
  description:
    "Temukan destinasi wisata budaya terbaik di seluruh Nusantara. Dari candi megah hingga desa adat tersembunyi, lengkap dengan konteks sejarah dan kearifan lokal.",
  keywords: [
    "wisata budaya Indonesia",
    "destinasi Nusantara",
    "candi",
    "desa adat",
    "cultural tourism",
  ],
  icons: {
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`,
  },
  openGraph: {
    title: "NusantaraGuide AI — Jelajahi Jiwa Budaya Nusantara",
    description:
      "Temukan destinasi wisata budaya terbaik di seluruh Nusantara. Dari candi megah hingga desa adat tersembunyi, lengkap dengan konteks sejarah dan kearifan lokal.",
    url: "https://nusantaraguide.id",
    siteName: "NusantaraGuide AI",
    images: [
      {
        url: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Candi Borobudur saat matahari terbit",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-amber-50 text-amber-950 font-sans">
        <ErrorBoundary>
          <DemoBanner />
          <OnboardingOverlay />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
