import AmbientField from "@/components/AmbientField";
import BrandMark from "@/components/BrandMark";
import OrnamentStrings from "@/components/OrnamentStrings";
import ShirtDisplay from "@/components/ShirtDisplay";
import SignatureLine from "@/components/SignatureLine";

/**
 * The homepage hero: the faded brand mark as a masthead, the shirt as the
 * dominant piece of content, and — filling the wide side margins that used to
 * read as empty — hanging ornament strings and drifting stipple shapes. All of
 * that decoration sits behind the content layer.
 */
export default function Hero() {
  return (
    <section className="hero" aria-label="N.O.A.X">
      <OrnamentStrings max={4} />
      <AmbientField max={6} />

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
