/**
 * Per-photo zoom for the product gallery.
 *
 * The problem this solves is in the source photography, not the CSS. Every shot
 * is cropped differently, so `object-fit: contain` — which faithfully fits each
 * *image* to the frame — faithfully preserves the inconsistency, and the garment
 * lands at a different size on every page. Measured as a fraction of a square
 * contain-fit frame:
 *
 *   design-1.png            87.0w x 72.6h   <- the reference
 *   design-2*.png (all 4)  100.0w x 82.9h   full-bleed crop, no margin at all
 *   design-3.png            64.5w x 53.4h   loose crop, floating in the frame
 *   design-3-back.png      100.0w x 82.8h   full-bleed
 *
 * CAT. 03 is the worst of it: its own front and back are cropped so differently
 * that the shirt jumps 55% larger when you click from Front to Back.
 *
 * The factors below bring each one back to design-1's proportions. They are
 * measured, not eyeballed: the garment's bounding box was found by decoding each
 * PNG and taking its alpha channel (the cutouts) or its difference from the
 * corner colour (the studio shots), then scaled so the garment covers the same
 * area of the frame as the reference. Every scale-up was checked to confirm it
 * pushes only empty margin out of the frame — no garment is clipped.
 *
 * Two classes, normalised differently on purpose:
 *
 *  - Cutouts are matched on garment area. Safe on both axes here because every
 *    cutout shares the same garment aspect (1.197-1.207), so the width and
 *    height corrections agree to under 1%.
 *  - Worn shots are matched on subject *height* only. Their widths swing with
 *    how far the model's arms are from their body, and that is pose, not scale —
 *    matching on area would shrink a shot for having its elbows out.
 *
 * Only photos that deviate by 1% or more are listed; everything else is already
 * on reference and takes the default of 1. To re-derive these after re-cropping
 * a photo, measure the garment box and divide the reference's frame coverage by
 * the new one.
 */
const PHOTO_SCALE: Record<string, number> = {
  /* Full-bleed crops — the garment runs to all four edges. Pulled back to
     leave design-1's margin around it. */
  "/shirts/design-2.png": 0.873,
  "/shirts/design-2-back.png": 0.873,
  "/shirts/design-2-switch.png": 0.873,
  "/shirts/design-2-switch-back.png": 0.873,
  "/shirts/design-3-back.png": 0.873,
  "/shirts/design-3-switch-back.png": 0.873,

  /* The loose ones. Both CAT. 03 fronts sit in a wide empty field. */
  "/shirts/design-3.png": 1.354,
  "/shirts/design-3-switch.png": 1.353,

  /* Worn shots, already close to the reference — these are trims, not fixes. */
  "/shirts/design-2-model.png": 1.035,
  "/shirts/design-2-switch-model.png": 1.022,
  "/shirts/design-3-model.png": 1.01,
  "/shirts/design-3-switch-model.png": 1.018,
};

/** 1 for anything unlisted, so a new photo renders untouched until measured. */
export function scaleOf(src: string): number {
  return PHOTO_SCALE[src] ?? 1;
}
