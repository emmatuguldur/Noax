import CornerMarks from "@/components/CornerMarks";
import GeoDivider from "@/components/GeoDivider";
import GrainOverlay from "@/components/GrainOverlay";
import Hero from "@/components/Hero";
import ShapeField from "@/components/ShapeField";

/**
 * Homepage flow: hero → geometric divider → the shape field (shapes scatter,
 * then converge into a centered row and rest there). Grain textures the whole
 * page; corner micro-type frames the viewport like a gallery placard.
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <GeoDivider />
      <ShapeField />
      <GrainOverlay />
      <CornerMarks />
    </main>
  );
}
