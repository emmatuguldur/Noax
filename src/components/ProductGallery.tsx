"use client";

import { useState } from "react";

import type { Design } from "@/data/designs";

interface View {
  src: string;
  label: string;
  alt: string;
}

/**
 * One large frame plus a thumbnail row. Deliberately plain: this is a product
 * gallery, and the page already has enough going on around it.
 *
 * The frames are square with `object-fit: contain` because the three views do
 * not share a ratio — the front and back cutouts are 1.19:1 landscape and the
 * model shot is 0.75:1 portrait. A square is the one frame that holds both
 * without either cropping the garment or stranding it in a band of empty void,
 * and it means real photography can be dropped in later at any ratio.
 *
 * A slot with no back or model view renders a single frame and no thumbnails —
 * CAT. 04 and 05 are still unphotographed. Note that this reads `design.back`
 * and `design.model`, not the disk: files sitting in `public/shirts/` that no
 * entry in `designs.ts` names are invisible here.
 */
export default function ProductGallery({ design }: { design: Design }) {
  const views: View[] = [
    { src: design.photo, label: "Front", alt: `${design.name}, front view` },
    ...(design.back
      ? [{ src: design.back, label: "Back", alt: `${design.name}, back view` }]
      : []),
    ...(design.model
      ? [{ src: design.model, label: "Worn", alt: `${design.name}, worn` }]
      : []),
  ];

  const [active, setActive] = useState(0);
  const view = views[active];

  /** Wraps both ways, so the three views are a loop rather than a dead end. */
  const step = (delta: number) =>
    setActive((i) => (i + delta + views.length) % views.length);

  return (
    <div className="product-gallery">
      <figure className="product-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={view.src} alt={view.alt} draggable={false} />

        {views.length > 1 && (
          <>
            <button
              type="button"
              className="product-nav product-nav-prev"
              onClick={() => step(-1)}
              aria-label="Previous view"
            >
              <Chevron />
            </button>
            <button
              type="button"
              className="product-nav product-nav-next"
              onClick={() => step(1)}
              aria-label="Next view"
            >
              <Chevron next />
            </button>
          </>
        )}

        <figcaption className="product-frame-tag">
          [ {view.label.toUpperCase()} ]
        </figcaption>
      </figure>

      {views.length > 1 && (
        <div className="product-thumbs" role="tablist" aria-label="Views">
          {views.map((v, i) => (
            <button
              key={v.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={v.label}
              className={i === active ? "product-thumb product-thumb-on" : "product-thumb"}
              onClick={() => setActive(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.src} alt="" draggable={false} />
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Same stroke weight and cap style as the hero's design-cycling arrow. */
function Chevron({ next = false }: { next?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={next ? "M5 12h13M12 5l7 7-7 7" : "M19 12H6M12 5l-7 7 7 7"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
