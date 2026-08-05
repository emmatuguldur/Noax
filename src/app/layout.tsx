import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Inter, Martian_Mono } from "next/font/google";

import SmoothScroll from "@/components/SmoothScroll";

import "./globals.css";

/**
 * Three faces, each with one job:
 *  - Inter     display / the "N.O.U.X" wordmark and headers — an ultra-refined
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

/**
 * The hero statement, and nothing else on the site. Everything here is a
 * grotesque or a monospace — all machine, no hand — so the one moment the
 * label actually speaks in its own voice gets the one face with a wrist in it.
 * (v4 loaded this for a quote section; v5 removed both. The face was never the
 * problem, so it's back for the line that earns it.)
 */
const serif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "N.O.U.X — stipple prints on heavyweight cotton",
  description:
    "Five hand-stippled prints, screened on 240gsm combed cotton in Ulaanbaatar.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${sans.variable} ${serif.variable}`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
