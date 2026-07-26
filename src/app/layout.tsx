import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Martian_Mono } from "next/font/google";

import SmoothScroll from "@/components/SmoothScroll";

import "./globals.css";

/**
 * Three faces, each with one job:
 *  - Inter     display / the "N.O.A.X" wordmark and headers — an ultra-refined
 *              grotesque (Neue Haas / Suisse Int'l spirit), tracked wide for an
 *              editorial / exhibition-catalogue feel.
 *  - Martian   the ASCII rendering, metadata, and corner micro-type.
 *  - Archivo   body prose.
 */
const display = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  variable: "--font-display",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const sans = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "N.O.A.X — stipple prints on heavyweight cotton",
  description:
    "Five hand-stippled prints, screened on 240gsm combed cotton in Ulaanbaatar.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
