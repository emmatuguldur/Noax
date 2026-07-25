"use client";

import Link from "next/link";

import type { NavItem } from "@/data/navItems";

interface NavShapeProps {
  item: NavItem;
  /** Outer cell element — reveal transform is written here. */
  shellRef: (el: HTMLAnchorElement | null) => void;
  /** Inner plate — idle 3D rotation is written here. */
  plateRef: (el: HTMLSpanElement | null) => void;
}

/**
 * One of the four shapes in the centered reveal. It is now a real navigation
 * link to its own page. The supplied stipple drawing is kept intact on a CSS
 * 3D perspective plate (a generated primitive would not match the hand
 * stippling), inverted to paper-on-void.
 */
export default function NavShape({ item, shellRef, plateRef }: NavShapeProps) {
  return (
    <Link
      href={item.href}
      ref={shellRef}
      className="nav-shape"
      data-shape={item.id}
      aria-label={item.label}
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
