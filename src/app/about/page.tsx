import type { Metadata } from "next";

import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "About — N.O.A.X" };

export default function AboutPage() {
  return (
    <PageShell eyebrow="About" title="A stack of drawings that needed to leave the studio.">
      <p>
        N.O.A.X began as stipple work that took too long to be worth framing.
        Printing it was the only way to get it out of the room.
      </p>
      <p>
        The blank was chosen once and has not changed since. Runs are small, cut in
        the same weight every season, and numbered by the print rather than by the drop.
      </p>
    </PageShell>
  );
}
