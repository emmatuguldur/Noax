import Link from "next/link";

import { HERO_COPY } from "@/data/copy";

/**
 * The homepage hero — the campaign poster, whole.
 *
 * v13 replaced the ASCII dissolve (`ShirtDisplay` + `AsciiRenderer`) with the
 * poster. v13.1 stopped taking the poster apart: an earlier pass painted the
 * three walking figures out of the plate and re-laid them as overlapping
 * panels, which meant the photograph on the page was never the photograph that
 * was shot. It is now — the plate is the original frame, uncut, and the
 * walkers are where the camera found them.
 *
 * Two layers: the plate, and the black rules laid over it.
 *
 * ---------------------------------------------------------------------------
 * Why the bars overlay the photograph instead of sitting above and below it
 *
 * The plate is 2.133:1, which is the canvas ratio exactly. Reserve strips for
 * the bars and the picture area becomes 1920x774 (2.48:1), so a `cover` fit
 * would crop the plate top and bottom — and the two things that would go are
 * the sunglasses and the boots, i.e. both ends of the composition. The bars
 * float on top instead, so the frame is never cropped to make room for them.
 *
 * v22 then inset the plate to 90% and dropped it 64px, because full-bleed left
 * the scene with 30px of air above it and 63 below. Shrinking rather than
 * sliding was forced: 93px of total slack cannot be redistributed into a
 * generous top margin. It now sits 81px clear above and 80px below, and the
 * plate's own top and bottom edges tuck under the two bars — see the geometry
 * worked through in `globals.css`.
 *
 * ---------------------------------------------------------------------------
 * Sizing
 *
 * `.poster-hero` is a fixed-ratio box capped at the 1920x900 design size, and
 * its children are positioned in percentages of it, so the whole composition
 * scales as one drawing rather than a layout that reflows. Type is sized in
 * `cqw` for the same reason — tied to the canvas, not the viewport, so it does
 * not keep growing once the canvas has hit its cap on a wide monitor.
 *
 * Below 720px the canvas turns portrait and `cover` crops the plate to its
 * centre, which is the seated figure — see `globals.css`.
 */
export default function Hero() {
  return (
    <section className="poster-hero" aria-label="N.O.U.X">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/poster-full.jpg"
        alt="A headless figure in a black N.O.U.X print tee and black jeans, seated on a folding chair with sunglasses floating where the head would be, as blurred passers-by walk through the frame."
        className="poster-plate"
        width={1920}
        height={900}
        fetchPriority="high"
        draggable={false}
      />

      {/* The pin, in the empty ground left of the figure. Four layers, because
          three of them have to be able to move on their own: the base carries
          the pin, the wire script and the chains and never moves; each charm
          is cut at the chain link it hangs from so it can swing about that
          point. The tag sits *under* the base on purpose — the chain crosses
          its top corner in the original photograph, and keeping the base in
          front is what preserves that overlap while the tag swings behind it.
          Decorative, so the whole thing is hidden from assistive tech. */}
      <div className="hero-pin" aria-hidden="true">
        <span className="pin-charm charm-tag">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/charm-tag.png" alt="" width={172} height={183} draggable={false} />
        </span>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/pin-base.png"
          alt=""
          className="pin-base"
          width={300}
          height={402}
          draggable={false}
        />

        <span className="pin-charm charm-board">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/charm-board.png" alt="" width={45} height={117} draggable={false} />
        </span>

        <span className="pin-charm charm-flower">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/charm-flower.png" alt="" width={59} height={67} draggable={false} />
        </span>
      </div>

      {/* The plain-language way in. The four nav shapes already reach /shop,
          but they read as a puzzle before they read as a menu, so this is the
          same destination stated outright. It sits under the pin rather than
          centred because the only clear band across the middle is the 80px
          between the boots and the foot bar — enough for one element, and the
          scroll nudge has the better claim on it. */}
      <Link href="/shop" className="poster-cta">
        {HERO_COPY.shopCta}
      </Link>

      {/* Decorative: "keep going" is guidance for the eye, and a screen reader
          is not scrolling to find the next section. */}
      <div className="poster-scroll" aria-hidden="true">
        <span className="poster-scroll-label">{HERO_COPY.scrollHint}</span>
        <svg
          className="poster-scroll-chev"
          viewBox="0 0 18 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="square"
        >
          <path d="M1 1 L9 7.6 L17 1" />
        </svg>
      </div>

      <div className="poster-bar">
        <p className="poster-caption stage stage-1">{HERO_COPY.overline}</p>
        <p className="poster-word">N.O.U.X</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/flower.png"
          alt=""
          className="poster-logo"
          width={64}
          height={64}
          aria-hidden="true"
          draggable={false}
        />
      </div>

      <div className="poster-foot" aria-hidden="true" />
    </section>
  );
}
