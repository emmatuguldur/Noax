import type { Metadata } from "next";

import PageShell from "@/components/PageShell";
import ShopChaos from "@/components/ShopChaos";

export const metadata: Metadata = { title: "Shop — N.O.A.X" };

export default function ShopPage() {
  return (
    <PageShell
      eyebrow="Shop"
      title="Five prints, one blank."
      bleed={<ShopChaos />}
    >
      <p>
        240gsm combed cotton, boxy through the body, double-stitched at the hem.
        Water-based ink, so the print sits in the fabric rather than on top of it.
      </p>
    </PageShell>
  );
}
