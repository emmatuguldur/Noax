import BrandMark from "@/components/BrandMark";
import Cobwebs from "@/components/Cobwebs";
import ShirtDisplay from "@/components/ShirtDisplay";
import SignatureLine from "@/components/SignatureLine";
import { HERO_COPY } from "@/data/copy";

/**
 * The homepage hero.
 *
 * What's left under the shirt is the spec line and nothing else. v8 put a
 * two-part statement here, staged against the ASCII dissolve; v12 moved it down
 * to the material section, where it sits beside the fabric it's describing
 * instead of competing with the garment directly above it. The hero is back to
 * the shirt, its accession data, and the way out.
 *
 * All copy is placeholder — see `src/data/copy.ts`, which is written to be
 * overwritten.
 */
export default function Hero() {
  return (
    <section className="hero" aria-label="N.O.A.X">
      <div className="hero-pillars" aria-hidden="true">
        <span className="pillar pillar-left" />
        <span className="pillar pillar-right" />
      </div>

      {/* Corner drapes, at z-0 alongside the pillars so everything in
          `.hero-content` (z-1) stays in front of them. */}
      <Cobwebs />

      <div className="hero-content">
        <div className="hero-head">
          <p className="hero-overline stage stage-1">{HERO_COPY.overline}</p>
          <BrandMark />
        </div>

        <div className="hero-stage">
          <ShirtDisplay />
        </div>

        <div className="hero-say">
          <p className="hero-spec stage stage-5">{HERO_COPY.spec}</p>
        </div>

        <div className="hero-foot">
          <SignatureLine />
          <p className="scroll-hint stage stage-6">{HERO_COPY.scrollHint}</p>
        </div>
      </div>
    </section>
  );
}
