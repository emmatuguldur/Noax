export interface NavItem {
  id: string;
  label: string;
  /** Real route — these are pages, not same-page anchors. */
  href: string;
  /** Stipple artwork for this shape. */
  art: string;
  /**
   * Left-to-right order in the centred row.
   *
   * v24 removed the `hero` / `heroMobile` anchors that used to sit alongside
   * this. The four no longer appear over the poster at all — they belong to
   * the shape section and nothing else — so there is no start position to
   * travel from and this is the only placement each shape has. The column
   * geometry those anchors encoded is in git at v23 if it is ever wanted back.
   */
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
    rowOrder: 0,
    phase: 0,
    speed: 0.13,
  },
  {
    id: "shop",
    label: "Shop",
    href: "/shop",
    art: "/shapes/diamond.png",
    rowOrder: 1,
    phase: 2.1,
    speed: 0.15,
  },
  {
    id: "story",
    label: "Story",
    href: "/story",
    art: "/shapes/sphere.png",
    rowOrder: 2,
    phase: 4.4,
    speed: 0.11,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    art: "/shapes/triangle.png",
    rowOrder: 3,
    phase: 1.2,
    speed: 0.14,
  },
];
