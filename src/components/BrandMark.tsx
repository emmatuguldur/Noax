/**
 * v2 brand mark.
 *
 * The pointillism treatment is gone: the flower is the flat original artwork,
 * shown as a low-opacity watermark whose edges are dissolved by a radial mask
 * so it melts into the page rather than sitting on it as a hard rectangle.
 *
 * Stacking is flower-behind, wordmark-in-front. The wordmark is set in Inter —
 * a separate face from the ASCII monospace, per the v2 brief.
 */
export default function BrandMark() {
  return (
    <div className="brand-mark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/flower.png" alt="" className="brand-flower" aria-hidden="true" />
      <h1 className="brand-word">N.O.A.X</h1>
    </div>
  );
}
