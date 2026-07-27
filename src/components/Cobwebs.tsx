/**
 * The neglect layer: webs drooping from the top corners of the page.
 *
 * Two different drawings rather than one mirrored twice — decay that matches on
 * both sides reads as ornament, which is the opposite of the point. Both are
 * ink-on-paper line art, so they invert like the shapes, and each is feathered
 * by a radial mask anchored at its own corner: the mask only ever takes the
 * *inner* edge, so the torn silhouette on the hanging side survives intact and
 * the canvas never shows as a rectangle.
 *
 * This lives in the hero's z-0 framing layer, so it is always behind the
 * wordmark and the shirt — and, being fixed-overlay territory, always behind
 * the nav shapes too.
 *
 * The spider that used to hang here now belongs to the shape section; it
 * arrives with the row rather than greeting you on load. See `ShapeField`.
 */
export default function Cobwebs() {
  return (
    <div className="hero-webs" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/decor/cobweb-2.png" alt="" className="cobweb cobweb-tl" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/decor/cobweb-1.png" alt="" className="cobweb cobweb-tr" />
    </div>
  );
}
