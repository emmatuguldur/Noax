export interface NavItem {
  id: string;
  label: string;
  /** Real route — these are pages, not same-page anchors. */
  href: string;
  /** Stipple artwork for this shape. */
  art: string;
  /**
   * Start-of-scroll position, as a fraction of the *hero poster's box* — not
   * the viewport. `ShapeField` resolves it against the centred, ratio-locked
   * poster rect, so a shared `x` puts the four in a true column against the
   * artwork on any screen width.
   *
   * The four sit in one vertical stack down the poster's right side, in
   * `rowOrder` from the top, so the order you meet them in is the order they
   * land in once the row assembles. `y` values are evenly spaced and centred
   * on the gray between the two black bars (which occupy the top 11.1% and
   * the bottom 2.9%).
   *
   * Spacing is 0.178, opened up from 0.16 in v19. It is not free to raise
   * further: the shapes are a fixed 118px while the poster scales with the
   * viewport, so the stack is at its tightest on the *narrowest* desktop, not
   * the widest. At the 768px compact breakpoint the poster is only 360px tall
   * and the four have 6.8px of clearance above and 12.6px below — 0.196 is
   * the hard ceiling there. Raising it beyond that needs the shapes to scale
   * with the poster, which would also resize the assembled row (`DESKTOP.size`
   * feeds both), so it is not a local change.
   */
  hero: { x: number; y: number };
  heroMobile: { x: number; y: number };
  /** Left-to-right order in the centered row the shapes converge into. */
  rowOrder: number;
  /** Idle motion is offset per shape so the four never move in lockstep. */
  phase: number;
  /**
   * Idle cycle rate. Cut to roughly a third in v18 — at the old values a full
   * bob took about 7s, which read as active movement against a still
   * photograph; these put it nearer 25s. The four stay mutually prime-ish so
   * the group never resolves into a visible pulse.
   */
  speed: number;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "about",
    label: "About",
    href: "/about",
    art: "/shapes/star.png",
    hero: { x: 0.9, y: 0.274 },
    heroMobile: { x: 0.87, y: 0.258 },
    rowOrder: 0,
    phase: 0,
    speed: 0.13,
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    art: "/shapes/diamond.png",
    hero: { x: 0.9, y: 0.452 },
    heroMobile: { x: 0.87, y: 0.443 },
    rowOrder: 1,
    phase: 2.1,
    speed: 0.15,
  },
  {
    id: "story",
    label: "Story",
    href: "/story",
    art: "/shapes/sphere.png",
    hero: { x: 0.9, y: 0.63 },
    heroMobile: { x: 0.87, y: 0.628 },
    rowOrder: 2,
    phase: 4.4,
    speed: 0.11,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    art: "/shapes/triangle.png",
    hero: { x: 0.9, y: 0.808 },
    heroMobile: { x: 0.87, y: 0.813 },
    rowOrder: 3,
    phase: 1.2,
    speed: 0.14,
  },
];
