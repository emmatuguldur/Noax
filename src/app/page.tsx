import CornerMarks from "@/components/CornerMarks";
import GrainOverlay from "@/components/GrainOverlay";
import Hero from "@/components/Hero";
import ShapeField from "@/components/ShapeField";
import ViewportFrame from "@/components/ViewportFrame";

/**
 * Homepage flow: hero → the shape field (shapes scatter, then converge into a
 * centered row and rest there). Grain textures the whole page; a hairline
 * perimeter frame and corner micro-type frame the viewport like an archival
 * artifact.
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <ShapeField />
      <GrainOverlay />
      <ViewportFrame />
      <CornerMarks />
    </main>
  );
}
