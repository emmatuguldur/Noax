/**
 * Two carved columns flanking the shirt — the literal version of the hairline
 * `.pillar` rules v6 put in the same place, and the reason the hero reads as a
 * hall rather than a page.
 *
 * They are atmosphere, so they sit in the hero's z-0 framing layer behind the
 * content, faded to roughly the flower watermark's weight and desaturated into
 * the two-ink palette.
 *
 * Sizing and placement are entirely in CSS and derived from the artwork's real
 * geometry — see `.hero-columns` in `globals.css`, which explains the two
 * constants. Nothing here sets a width: `height` + `width: auto` is what keeps
 * the 1:3.12 shaft from ever being stretched.
 */
export default function HeroColumns() {
  return (
    <div className="hero-columns" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/decor/column.png" alt="" className="hero-column hero-column-left" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/decor/column.png" alt="" className="hero-column hero-column-right" />
    </div>
  );
}
