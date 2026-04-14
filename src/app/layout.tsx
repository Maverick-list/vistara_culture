import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import ErrorBoundary from "@/components/ErrorBoundary";
import DemoBanner from "@/components/DemoBanner";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import Footer from "@/components/Footer";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vistara-culture.azurewebsites.net";

export const metadata: Metadata = {
  title: {
    default: "Vistara — Jelajahi Jiwa Budaya Nusantara",
    template: "%s | Vistara — Jelajahi Jiwa Budaya Nusantara",
  },
  description:
    "Platform AI wisata budaya Indonesia. Temukan makna mendalam di balik setiap destinasi — candi, ritual, seni, dan kearifan lokal — dengan panduan AI yang berpengetahuan luas.",
  keywords: [
    "wisata budaya Indonesia",
    "cultural tourism AI",
    "heritage Indonesia",
    "destinasi Nusantara",
    "kearifan lokal",
    "Azure AI",
    "Vistara Culture",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`,
  },
  openGraph: {
    title: "Vistara — Jelajahi Jiwa Budaya Nusantara",
    description:
      "Temukan makna mendalam di balik destinasi budaya Indonesia dengan panduan AI. Platform eksplorasi warisan sejarah, seni, dan ritual Nusantara.",
    url: SITE_URL,
    siteName: "Vistara Culture",
    images: [
      {
        url: "/og-image.jpg", // Assume generic image exists or use a high-res Unsplash as fallback
        width: 1200,
        height: 630,
        alt: "Vistara — Cultural Intelligence Tourism Platform",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vistara — Jelajahi Jiwa Budaya Nusantara",
    description: "Nikmati perjalanan budaya Indonesia yang lebih bermakna dengan dukungan AI.",
    images: ["/og-image.jpg"],
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
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
