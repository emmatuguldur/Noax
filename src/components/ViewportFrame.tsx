/**
 * A hairline perimeter frame inset from the viewport edge, with a small
 * precision crosshair at each corner — a "framed artifact" / archival-blueprint
 * motif that pairs with the corner micro-typography. Fixed, non-interactive.
 * Each crosshair is drawn from two 1px rules (via CSS) rather than a glyph, so
 * it stays crisp.
 */
export default function ViewportFrame() {
  return (
    <div className="viewport-frame" aria-hidden="true">
      <span className="vf-cross vf-cross-tl" />
      <span className="vf-cross vf-cross-tr" />
      <span className="vf-cross vf-cross-bl" />
      <span className="vf-cross vf-cross-br" />
    </div>
  );
}
