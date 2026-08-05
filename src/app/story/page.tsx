import type { Metadata } from "next";

import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Story — N.O.U.X" };

export default function StoryPage() {
  return (
    <PageShell eyebrow="Story" title="Every mark is one dot.">
      <p>
        No lines, no fills. A drawing the size of a hand takes three to five weeks, and
        the density of the shading is only ever a decision about how many dots go where.
      </p>
      <p>
        This site works the same way. Hover a shirt and it resolves into text characters
        for the same reason: a screen print is a judgement about how much ink lands on
        how much cloth, and typing it out makes that judgement visible.
      </p>
    </PageShell>
  );
}
