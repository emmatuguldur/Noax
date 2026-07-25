import BrandMark from "@/components/BrandMark";
import ShirtDisplay from "@/components/ShirtDisplay";
import SignatureLine from "@/components/SignatureLine";

/**
 * The homepage hero: the faded brand mark as a masthead, and the shirt as the
 * dominant piece of content beneath it. Nothing here is fixed or scroll-driven
 * anymore — the old nav layer is gone.
 */
export default function Hero() {
  return (
    <section className="hero" aria-label="N.O.A.X">
      <BrandMark />

      <div className="hero-stage">
        <ShirtDisplay />
      </div>

      <div className="hero-foot">
        <SignatureLine />
        <p className="scroll-hint">Scroll</p>
      </div>
    </section>
  );
}
