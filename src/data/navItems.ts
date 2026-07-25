export interface NavItem {
  id: string;
  label: string;
  /** Real route — these are pages, not same-page anchors. */
  href: string;
  /** Stipple artwork for this shape. */
  art: string;
  /** Loose, non-grid hero position as a fraction of the viewport (the start
   *  state on load — shapes scattered around the shirt). */
  hero: { x: number; y: number };
  heroMobile: { x: number; y: number };
  /** Left-to-right order in the centered row the shapes converge into. */
  rowOrder: number;
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
    hero: { x: 0.155, y: 0.375 },
    heroMobile: { x: 0.115, y: 0.3 },
    rowOrder: 0,
    phase: 0,
    speed: 0.42,
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    art: "/shapes/diamond.png",
    hero: { x: 0.215, y: 0.735 },
    heroMobile: { x: 0.145, y: 0.755 },
    rowOrder: 1,
    phase: 2.1,
    speed: 0.5,
  },
  {
    id: "story",
    label: "Story",
    href: "/story",
    art: "/shapes/sphere.png",
    hero: { x: 0.818, y: 0.678 },
    heroMobile: { x: 0.875, y: 0.718 },
    rowOrder: 2,
    phase: 4.4,
    speed: 0.37,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    art: "/shapes/triangle.png",
    hero: { x: 0.848, y: 0.302 },
    heroMobile: { x: 0.885, y: 0.262 },
    rowOrder: 3,
    phase: 1.2,
    speed: 0.46,
  },
];
