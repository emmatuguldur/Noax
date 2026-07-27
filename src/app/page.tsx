import CornerMarks from "@/components/CornerMarks";
import GrainOverlay from "@/components/GrainOverlay";
import Hero from "@/components/Hero";
import MaterialSection from "@/components/MaterialSection";
import ShapeField from "@/components/ShapeField";
import SiteFooter from "@/components/SiteFooter";
import ViewportFrame from "@/components/ViewportFrame";

/**
 * Homepage flow: hero → the shape row (shapes scatter, converge, hold, then
 * scroll away) → the material section → the footer. Grain textures the whole
 * page; a hairline perimeter frame and corner micro-type frame the viewport
 * like an archival artifact.
 *
 * The shape track is the one piece of structure worth explaining here.
 *
 * `.shape-field` is an overlay that has to cover the viewport from the very
 * first frame — the shapes start scattered *around the shirt*, so it is live
 * before you have scrolled at all — and then stop covering it once the row has
 * been assembled and held. That is a pin with a release, and `position: sticky`
 * is the mechanism: the field is the track's first child so it sticks from the
 * top of the page, and sticky containment means its box can never extend past
 * `.shape-track`'s bottom edge, which is exactly where `MaterialSection`
 * begins. The overlap is impossible by construction rather than timed away.
 *
 * The cost of that is one wrapper: sticky needs the field in normal flow, so
 * `.shape-under` is pulled back up by the field's own height to put the hero
 * back at the top of the page. Everything below the track is ordinary flow.
 */
export default function Page() {
  return (
    <main>
      <div className="shape-track">
        <ShapeField />
        <div className="shape-under">
          <Hero />
          {/* Scroll distance for the assemble and the hold; the field releases
              when its bottom reaches the end of this. */}
          <div className="shape-rail" aria-hidden="true" />
        </div>
      </div>

      <MaterialSection />
      <SiteFooter />
      <GrainOverlay />
      <ViewportFrame />
      <CornerMarks />
    </main>
  );
}
