import AmbientField from "@/components/AmbientField";

/**
 * A single evocative line, alone in its own full-bleed section with generous
 * negative space. Copy is placeholder for now — structure and typography are
 * the point of this pass.
 *
 * This is also the one section carrying the ornamental, non-rectangular framing
 * device (an organic arch drawn behind the line) to break up the otherwise
 * all-rectangular layout.
 */
export default function QuoteSection() {
  return (
    <section className="quote" aria-label="Manifesto">
      <AmbientField max={2} />

      <div className="quote-inner">
        <svg
          className="quote-arch"
          viewBox="0 0 420 540"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* An open cathedral arch: straight sides rising into a round head. */}
          <path
            d="M28 528 L28 224 A182 182 0 0 1 392 224 L392 528"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        <p className="quote-text">
          N.O.A.X <span className="quote-dash">—</span>{" "}
          <span className="quote-placeholder">[placeholder tagline here]</span>
        </p>
      </div>
    </section>
  );
}
