/**
 * ============================================================================
 * TODO(noux): PLACEHOLDER COPY — THESE ARE MY WORDS, NOT YOURS. OVERWRITE THEM.
 * ============================================================================
 *
 * Every string below is a stand-in so you can see the page working at full
 * strength. The *structure* is the deliverable — the rhythm of a short opening
 * beat, a two-part statement that lands in two breaths, and dry spec lines
 * against it. Keep that shape and swap the words for your own voice.
 *
 * I wrote these from facts already true in your codebase rather than inventing
 * a brand personality for you:
 *   - `/shop` says "water-based ink, so the print sits in the fabric rather
 *     than on top of it" — that became the statement.
 *   - `designs.ts` says editions of 100 across five catalogue slots — that
 *     became the spec line.
 *
 * Same convention the README already uses for NX-01 "Interference".
 */

export const HERO_COPY = {
  /**
   * Sits above the wordmark. One short breath before the brand name — keep it
   * under ~5 words or it stops reading as a whisper.
   */
  overline: "Printed in small batches",

  /**
   * Dry, factual line under the shirt. Specs, not poetry. v12 moved the
   * two-part statement that used to sit above this down into the material
   * section, where it has fabric to be about — see `MATERIAL_COPY.quote*`.
   */
  spec: "Five studies · editions of one hundred · never reprinted",

  /** The nudge at the bottom of the hero. */
  scrollHint: "Keep going",

  /**
   * The hero's one direct route to the shop. The four nav shapes already lead
   * there, but they are a puzzle before they are a menu — this is the reading
   * for someone who has just landed. Keep the word "shop" in it; the whole
   * point is that it says what it does.
   */
  shopCta: "ENTER THE ARCHIVE",
} as const;

/**
 * The material section. Same rule as above: placeholder words, real structure.
 * The shape to keep is heading → one paragraph of process detail → two hard
 * numbers, with the plates carrying the evidence alongside.
 */
export const MATERIAL_COPY = {
  eyebrow: "Material study",
  title: "Tactile permanence.",
  body:
    "Every garment is the result of rigorous textile testing. We use 380 GSM organic cotton, double-dyed to a depth of black that refuses to fade. The weight gives a structural silhouette that holds its line through movement.",

  /**
   * Two hard numbers against the prose. `unit` is the only place the ember
   * accent appears in this section, so keep it to a symbol or a word or two.
   */
  stats: [
    { value: "380", unit: "", label: "Grams per square metre" },
    { value: "100", unit: "%", label: "Organic combed cotton" },
  ],

  figures: [
    { src: "/fabric/texture-placeholder-1.png", alt: "Macro detail of the woven cotton face" },
    { src: "/fabric/texture-placeholder-2.png", alt: "Macro detail of a woven garment label and stitching" },
  ],
} as const;

/**
 * Closing content.
 *
 * The navigation column deliberately repeats the four shape destinations as
 * plain text links — the ordinary footer pattern, and the accessible way to
 * reach those pages without working a scroll-driven animation. It duplicates
 * the shapes; it does not replace them, and the shape field is untouched.
 *
 * `href` is what decides how an item renders in `SiteFooter`: internal routes
 * become `next/link`, `http(s)` opens in a new tab, `mailto:` becomes a plain
 * anchor, and an item with no href stays text rather than pretending to be a
 * link.
 */
export interface FooterItem {
  label: string;
  /**
   * Internal route, an `https://` URL, a `mailto:`, or omitted to render as
   * plain text.
   */
  href?: string;
}

export interface FooterColumn {
  tag: string;
  items: FooterItem[];
}

/* Annotated rather than `as const`: one item deliberately has no `href`, and
   under `as const` that widens to a union where `href` isn't a property at all
   and can't be read. */
export const FOOTER_COPY: {
  blurb: string;
  /**
   * The spec line under the brand blurb, drawn with a dotted leader between
   * key and value — the same treatment as the `Origin / Mongolia` row in the
   * product spec list on `/shop/[slug]`.
   */
  origin: { key: string; value: string };
  columns: FooterColumn[];
  legal: string;
  mark: string;
} = {
  blurb:
    "Exploring the tactile relationship between architectural concepts and textile engineering. Every piece is a considered study in permanence and minimalist form.",
  origin: { key: "Designed in", value: "Mongolia" },
  columns: [
    {
      tag: "Navigation",
      items: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Shop", href: "/shop" },
        { label: "Story", href: "/story" },
      ],
    },
    {
      tag: "Correspondence",
      items: [
        { label: "noaxthebest@gmail.com", href: "mailto:noaxthebest@gmail.com" },
        { label: "@nouxthebest", href: "https://instagram.com/nouxthebest" },
        { label: "Ulaanbaatar, MN" },
      ],
    },
    /* Its own column rather than appended to Navigation: these are obligations,
       not places to go, and the grid is `auto-fit` so a third tag costs nothing
       — it drops to a second row on narrow screens. */
    {
      tag: "Legal",
      items: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ],
  legal: "© 2026 N.O.U.X — All rights reserved",
  mark: "Designed for the archive",
};
