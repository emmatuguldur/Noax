interface LegalBlankProps {
  /** The fact, from `LEGAL` in `src/data/legal.ts`. `null` renders the blank. */
  value: string | null;
  /**
   * What is missing, in plain words and lower case — it is uppercased by CSS
   * and read out as-is by a screen reader. "registered legal entity name",
   * not "ENTITY".
   */
  label: string;
}

/**
 * Renders a fact, or — while it is still unknown — a loud gap in its place.
 *
 * The alternative is worse than it looks: prose like "operated by N.O.U.X" reads
 * as finished, so a missing registered entity name would survive to launch
 * unnoticed inside a document whose whole purpose is to say precisely who the
 * customer is contracting with. A blank that is impossible to read past is the
 * point. See the header of `src/data/legal.ts`.
 */
export default function LegalBlank({ value, label }: LegalBlankProps) {
  if (value) {
    return <>{value}</>;
  }

  return <span className="legal-blank">[{label}]</span>;
}
