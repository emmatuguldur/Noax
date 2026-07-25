import AmbientField from "@/components/AmbientField";
import BrandMark from "@/components/BrandMark";
import ShirtDisplay from "@/components/ShirtDisplay";
import SignatureLine from "@/components/SignatureLine";

/**
 * The homepage hero: the faded brand mark as a masthead, the shirt as the
 * dominant piece of content, and a scatter of ambient stipple shapes drifting
 * behind it all. Content sits above the ambient layer.
 */
export default function Hero() {
  return (
    <section className="hero" aria-label="N.O.A.X">
      <AmbientField max={5} />

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
