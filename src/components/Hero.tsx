import BrandMark from "@/components/BrandMark";
import ShirtDisplay from "@/components/ShirtDisplay";
import SignatureLine from "@/components/SignatureLine";

/**
 * The homepage hero: the faded brand mark as a masthead and the shirt as the
 * dominant piece of content. Two faint vertical rules flank the content like
 * exhibition-hall pillars — structural framing rather than decoration.
 */
export default function Hero() {
  return (
    <section className="hero" aria-label="N.O.A.X">
      <div className="hero-pillars" aria-hidden="true">
        <span className="pillar pillar-left" />
        <span className="pillar pillar-right" />
      </div>

      <div className="hero-content">
        <BrandMark />

        <div className="hero-stage">
          <ShirtDisplay />
        </div>

        <div className="hero-foot">
          <SignatureLine />
          <p className="scroll-hint">Scroll</p>
        </div>
      </div>
    </section>
  );
}
