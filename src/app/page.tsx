import GrainOverlay from "@/components/GrainOverlay";
import Hero from "@/components/Hero";
import QuoteSection from "@/components/QuoteSection";
import ShapeField from "@/components/ShapeField";

/**
 * Homepage flow:
 *   hero → (shapes scatter, then converge into a centered row, then lift away)
 *   → quote section.
 * ShapeField renders its own in-flow scroll spacer for the convergence, so the
 * quote lands cleanly after the shapes have departed. Grain sits over the whole
 * page, below the interactive overlays.
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <ShapeField />
      <QuoteSection />
      <GrainOverlay />
    </main>
  );
}
