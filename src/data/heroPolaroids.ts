import { DESIGNS } from "@/data/designs";

/**
 * The prints mounted around the vinyl in the hero.
 *
 * This is a *set*, not a layout. `HeroVinyl` derives every angle, radius and
 * z-index from `HERO_POLAROIDS.length`, so the carousel is whatever this array
 * says it is — there are no per-position constants anywhere in the component.
 *
 * ---------------------------------------------------------------------------
 * These are finished cards, not product shots
 *
 * `public/hero/print-0N.png` are complete polaroids: the grey card, the mat and
 * the shirt photograph are one flattened image, each already leaning at its own
 * angle on a transparent canvas. They are deliberately *not* `frontOf(design)`
 * — the shop's cutouts would need a frame drawn round them, and drawing one
 * here would put a second frame around artwork that already has one.
 *
 * Measured, so that none of it has to be guessed again:
 *
 *   - the cards are perfectly axis-aligned 476x573 rectangles. Not tilted — the
 *     top corner is exactly at the bounding box's left edge and the left corner
 *     exactly at its top, which no rotated rectangle can be. v28 assumed the
 *     lean was in the artwork and dropped the code tilt on that basis; the lean
 *     is the *shirt photo* inside the card, and the card is square to the world.
 *     `HeroVinyl` supplies the tilt.
 *   - all three cards are the same 476x573, so sizing by *height* renders them
 *     at a common scale. The canvases differ (687 / 542 / 496 wide) only in how
 *     much transparent padding each export left around that card.
 *   - that padding is not symmetric, so centring the canvas does not centre the
 *     card. `nudgeX` corrects it: it is
 *         (contentCentreX - canvasCentreX) / canvasWidth
 *     negated, as a percentage of the element's own width. Worth about 9px of
 *     spread across the three, which is visible once they are stacked tightly.
 *     Re-measure it if a card is ever re-exported.
 *
 * ---------------------------------------------------------------------------
 * Going from three to five
 *
 * Add an entry below pointing at a new `print-0N.png`. That is the whole
 * change: the ring re-spaces itself, the wrap point moves, and one more card
 * renders. No CSS and no component edit.
 *
 * The set is keyed to the catalogue by hand rather than derived from `DESIGNS`,
 * because CAT. 04 and 05 are not distinguishable by their data — `designs.ts`
 * gives them real-looking `photo` paths that resolve to files on disk, which
 * are CAT. 01's image standing in. Any predicate over the design record would
 * let those two through and put the same shirt on the record twice.
 */
const CARDS: readonly { cat: string; card: string; nudgeX: number }[] = [
  /* canvas 542x573, card at x 25..500  ->  centre off by -8.5px  */
  { cat: "01", card: "/hero/print-01.png", nudgeX: 1.568 },
  /* canvas 687x578, card at x 122..597 ->  centre off by +16px   */
  { cat: "02", card: "/hero/print-02.png", nudgeX: -2.329 },
  /* canvas 496x573, card at x 0..475   ->  centre off by -10.5px */
  { cat: "03", card: "/hero/print-03.png", nudgeX: 2.117 },
];

export interface HeroPolaroid {
  id: string;
  /** The finished polaroid card, frame and all. */
  src: string;
  alt: string;
  /**
   * Percent of the element's own width to shift it by, so the *card* ends up
   * centred rather than its canvas. Vertical offsets are all under 0.4% and are
   * left alone.
   */
  nudgeX: number;
}

/**
 * Alt text is built from the catalogue number rather than `name`, because CAT.
 * 02 and 03 are both still literally named "Forthcoming"; routing that into alt
 * text would announce two identical, meaningless labels. A card whose `cat` has
 * no matching design is dropped rather than rendered with a broken label.
 */
export const HERO_POLAROIDS: HeroPolaroid[] = CARDS.flatMap(({ cat, card, nudgeX }) => {
  const design = DESIGNS.find((d) => d.cat === cat);
  if (!design) return [];
  return [
    {
      id: design.id,
      src: card,
      nudgeX,
      alt: `Polaroid of the N.O.U.X print tee, catalogue number ${cat}`,
    },
  ];
});
