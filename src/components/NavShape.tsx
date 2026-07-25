"use client";

import Link from "next/link";

import type { NavItem } from "@/data/navItems";

interface NavShapeProps {
  item: NavItem;
  /** Base pixel size of the shape; ShapeField scales/positions from here. */
  size: number;
  /** Outer link — position, scale, and label opacity are written here. */
  shellRef: (el: HTMLAnchorElement | null) => void;
  /** Inner plate — idle 3D rotation is written here. */
  plateRef: (el: HTMLSpanElement | null) => void;
}

/**
 * One of the four shapes. It is a real navigation link. The supplied stipple
 * drawing is kept intact on a CSS perspective plate (a generated primitive
 * would not match the hand stippling), inverted to paper-on-void.
 *
 * The label's opacity is driven by the `--lo` custom property that ShapeField
 * writes as the shapes converge, so it fades in only once they line up.
 */
export default function NavShape({ item, size, shellRef, plateRef }: NavShapeProps) {
  return (
    <Link
      href={item.href}
      ref={shellRef}
      className="nav-shape"
      data-shape={item.id}
      aria-label={item.label}
      style={{ width: size, height: size }}
    >
      <span className="nav-shape-perspective">
        <span ref={plateRef} className="nav-shape-plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.art} alt="" draggable={false} />
        </span>
      </span>
      <span className="nav-shape-label">{item.label}</span>
    </Link>
  );
}
