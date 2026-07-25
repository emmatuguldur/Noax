import Hero from "@/components/Hero";
import ShapeReveal from "@/components/ShapeReveal";

/**
 * Homepage: hero (shirt + brand mark) and the centered shape reveal. No inline
 * About/Contact/Shop/Story content — those are their own routes now.
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <ShapeReveal />
    </main>
  );
}
