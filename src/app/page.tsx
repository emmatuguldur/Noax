import CornerMarks from "@/components/CornerMarks";
import Hero from "@/components/Hero";
import MaterialSection from "@/components/MaterialSection";
import ShapeField from "@/components/ShapeField";
import SiteFooter from "@/components/SiteFooter";
import ViewportFrame from "@/components/ViewportFrame";

/**
 * Homepage flow: hero → the shape row → the material section → the footer. A
 * hairline perimeter frame and corner micro-type frame the viewport like an
 * archival artifact.
 *
 * The film grain that used to sit over all of this (`GrainOverlay`, z-30) was
 * dropped in v23. The component and its `.grain` rule are both still here, so
 * putting it back is one import and one tag.
 *
 * This used to need explaining. The shape row was a pinned overlay — a sticky
 * `.shape-field` wrapped in a `.shape-track`, with `.shape-under` dragged back
 * up by a viewport height and a `.shape-rail` supplying scroll distance — all
 * so the four shapes could start scattered over the hero and converge as you
 * scrolled. v24 took them off the hero and v25 removed the entrance, and with
 * nothing left to pin, the entire apparatus went with it. The shape row is now
 * an ordinary section between two other ordinary sections, which is why there
 * is nothing here to describe.
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <ShapeField />
      <MaterialSection />
      <SiteFooter />
      <ViewportFrame />
      <CornerMarks />
    </main>
  );
}
