"use client";

import Link from "next/link";
import { useState } from "react";

import ColorSelect from "@/components/ColorSelect";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchase from "@/components/ProductPurchase";
import type { Design } from "@/data/designs";

interface ProductDetailProps {
  design: Design;
  /**
   * The static half of the right-hand column — blurb, spec list, description.
   * It stays server-rendered in `page.tsx` and passes through here as a slot,
   * so making the colourway interactive doesn't drag the page's copy into the
   * client bundle with it.
   */
  children: React.ReactNode;
}

/**
 * Owns the selected colourway, because the two controls that care about it sit
 * in different columns: the swatches are in the right-hand purchase block and
 * the gallery they drive is in the left. This is the nearest common parent, so
 * the state lives here and goes down as props — a context for one integer would
 * be more machinery than the problem.
 *
 * The swatch row only renders when there is a second colour to switch to, so
 * CAT. 01, 04 and 05 show no selector at all rather than a control with one
 * option in it.
 */
export default function ProductDetail({ design, children }: ProductDetailProps) {
  const [colorway, setColorway] = useState(0);

  return (
    <div className="product">
      <ProductGallery design={design} colorway={design.colorways[colorway]} />

      <div className="product-info">
        {children}

        {design.colorways.length > 1 && (
          <ColorSelect
            colorways={design.colorways}
            selected={colorway}
            onSelect={setColorway}
          />
        )}

        <ProductPurchase />

        <Link href="/shop" className="product-back">
          ← All prints
        </Link>
      </div>
    </div>
  );
}
