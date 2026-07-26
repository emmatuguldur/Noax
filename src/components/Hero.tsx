import BrandMark from "@/components/BrandMark";
import Cobwebs from "@/components/Cobwebs";
import HeroColumns from "@/components/HeroColumns";
import ShirtDisplay from "@/components/ShirtDisplay";
import SignatureLine from "@/components/SignatureLine";
import { HERO_COPY } from "@/data/copy";

/**
 * The homepage hero.
 *
 * v8 gives it something to say. Up to v7 the entire copy on this page was
 * "N.O.A.X", "View", a catalogue number and "Scroll" — a room full of framing
 * devices (pillars, frieze, crosshairs, accession tags) arranged around a
 * middle that never spoke. The frame was never the problem; the silence was.
 *
 * The statement below the shirt is the fix, and it's staged rather than
 * dropped: the shirt resolves out of its ASCII, and the two halves of the line
 * land one after the other while it does, so the words feel like the caption to
 * something that just happened. Timings live in CSS (`--t-*`) and are mirrored
 * from `ShirtDisplay`'s intro clock.
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

      {/* v9's atmosphere. Both layers sit at z-0 alongside the pillars, so
          everything in `.hero-content` (z-1) stays in front of them. */}
      <HeroColumns />
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
          {/* Two blocks, two beats. The turn is the payoff and arrives late and
              in the accent — the only warm thing on the page. */}
          <p className="hero-statement">
            <span className="stage stage-3">{HERO_COPY.statementLead}</span>{" "}
            <span className="stage stage-4 hero-turn">{HERO_COPY.statementTurn}</span>
          </p>
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
