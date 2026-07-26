import type { Metadata } from "next";

import PageShell from "@/components/PageShell";
import { DESIGNS } from "@/data/designs";

export const metadata: Metadata = { title: "Shop — N.O.A.X" };

export default function ShopPage() {
  return (
    <PageShell eyebrow="Shop" title="Five prints, one blank.">
      <p>
        240gsm combed cotton, boxy through the body, double-stitched at the hem.
        Water-based ink, so the print sits in the fabric rather than on top of it.
      </p>

      <div className="shop-grid">
        {DESIGNS.map((design) => (
          <article key={design.id} className="shop-card">
            <div className="shop-card-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={design.photo} alt={`${design.name} tee`} />
            </div>
            <h2 className="shop-card-name">{design.name}</h2>
            <p className="shop-card-meta">
              CAT. {design.cat} <span aria-hidden="true">·</span> {design.medium}
            </p>
            <p className="shop-card-blurb">{design.blurb}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
