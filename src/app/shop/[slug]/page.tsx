import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import PageShell from "@/components/PageShell";
import ProductDetail from "@/components/ProductDetail";
import { DESIGNS } from "@/data/designs";

/**
 * One page per catalogue slot, reached by clicking a card on `/shop`.
 *
 * The slug is the design's `id`, so the five pages are static and known at
 * build time — `generateStaticParams` below prerenders all of them and an
 * unknown slug 404s rather than rendering an empty template.
 *
 * Chrome comes from `PageShell` so this page carries the same header, nav and
 * footer as the other routes; the two-column layout goes in `bleed` because it
 * is wider than the shell's 36rem prose measure.
 */
interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DESIGNS.map((design) => ({ slug: design.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const design = DESIGNS.find((d) => d.id === slug);
  if (!design) return { title: "Not found — N.O.A.X" };
  return {
    title: `${design.name} — N.O.A.X`,
    description: design.blurb,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const design = DESIGNS.find((d) => d.id === slug);
  if (!design) notFound();

  return (
    <PageShell
      eyebrow={`Catalogue no. ${design.cat}`}
      title={design.name}
      bleed={
        /* `ProductDetail` owns the two-column frame and the colourway state the
           gallery and the swatches share; everything passed in here stays
           server-rendered. */
        <ProductDetail design={design}>
          <p className="product-blurb">{design.blurb}</p>

          <dl className="product-specs">
            <div className="product-spec">
              <dt>Material</dt>
              <dd>{design.medium}</dd>
            </div>
            <div className="product-spec">
              <dt>Fit</dt>
              <dd>{design.fit}</dd>
            </div>
            <div className="product-spec">
              <dt>Edition</dt>
              <dd>{design.edition}</dd>
            </div>
            <div className="product-spec">
              <dt>Origin</dt>
              <dd>{design.origin}</dd>
            </div>
          </dl>

          <p className="product-desc">{design.description}</p>
        </ProductDetail>
      }
    />
  );
}
