/**
 * Small, high-contrast monospace details tucked into the viewport corners —
 * gallery-placard flavour: a mark, a coordinate flourish, and material specs.
 * Low visual weight, decorative/informational, non-interactive.
 */
export default function CornerMarks() {
  return (
    <div className="corner-marks" aria-hidden="true">
      <span className="corner corner-tl">N.O.U.X</span>
      <span className="corner corner-tr">
        <span className="mark-cross" />
        47.92°N / 106.92°E
      </span>
      <span className="corner corner-bl">100% ORGANIC COTTON — 380 GSM</span>
      <span className="corner corner-br">STIPPLE EDITIONS / MMXXV</span>
    </div>
  );
}
