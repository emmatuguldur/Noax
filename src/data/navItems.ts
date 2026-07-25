export interface NavItem {
  id: string;
  label: string;
  /** Real route — these are pages now, not same-page anchors. */
  href: string;
  /** Stipple artwork for this shape. */
  art: string;
  /** Idle motion is offset per shape so the four never move in lockstep. */
  phase: number;
  speed: number;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "about",
    label: "About",
    href: "/about",
    art: "/shapes/star.png",
    phase: 0,
    speed: 0.42,
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    art: "/shapes/diamond.png",
    phase: 2.1,
    speed: 0.5,
  },
  {
    id: "story",
    label: "Story",
    href: "/story",
    art: "/shapes/sphere.png",
    phase: 4.4,
    speed: 0.37,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    art: "/shapes/triangle.png",
    phase: 1.2,
    speed: 0.46,
  },
];
