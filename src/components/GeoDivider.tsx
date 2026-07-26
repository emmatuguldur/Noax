/**
 * A fine-lined, repeating geometric pattern used as a horizontal divider
 * between sections. Subtle — texture that bridges the empty black, not a focal
 * point. The motif is a row of small diamond outlines tiled via an SVG pattern.
 */
export default function GeoDivider() {
  return (
    <div className="geo-divider" aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern
            id="noax-geo"
            width="28"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M14 2 L26 12 L14 22 L2 12 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
            />
            <line x1="0" y1="12" x2="2" y2="12" stroke="currentColor" strokeWidth="0.7" />
            <line x1="26" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#noax-geo)" />
      </svg>
    </div>
  );
}
