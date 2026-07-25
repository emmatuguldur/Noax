import Hero from "@/components/Hero";
import ShapeField from "@/components/ShapeField";

/**
 * Homepage: the hero (shirt + brand mark), then the shape field — four shapes
 * scattered around the shirt on load that scrub into a centered row as you
 * scroll. No inline About/Contact/Shop/Story content; those are their own
 * routes, reached by the shapes.
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <ShapeField />
    </main>
  );
}
