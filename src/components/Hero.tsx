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
