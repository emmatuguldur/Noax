import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Jost, Martian_Mono } from "next/font/google";

import "./globals.css";

/**
 * Three faces, each with one job:
 *  - Jost      display / the "N.O.A.X" wordmark (a clean, chic geometric sans;
 *              the v2 brief moved the wordmark off the ASCII monospace).
 *  - Martian   the ASCII rendering, and small technical labels.
 *  - Archivo   body prose.
 */
const display = Jost({
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

// Display serif for the manifesto/quote line — elegant, high-contrast, and a
// deliberate contrast to the geometric wordmark and the mono.
const serif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-serif",
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
    <html lang="en" className={`${display.variable} ${mono.variable} ${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
