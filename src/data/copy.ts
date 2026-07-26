/**
 * ============================================================================
 * TODO(noax): PLACEHOLDER COPY — THESE ARE MY WORDS, NOT YOURS. OVERWRITE THEM.
 * ============================================================================
 *
 * Every string below is a stand-in so you can see the page working at full
 * strength. The *structure* is the deliverable — the rhythm of a short opening
 * beat, a two-part statement that lands in two breaths, and a dry spec line
 * underneath. Keep that shape and swap the words for your own voice.
 *
 * I wrote these from facts already true in your codebase rather than inventing
 * a brand personality for you:
 *   - `/shop` says "water-based ink, so the print sits in the fabric rather
 *     than on top of it" — that became the statement.
 *   - `designs.ts` says editions of 100 across five catalogue slots — that
 *     became the spec line.
 *
 * Same convention the README already uses for NX-01 "Interference".
 */

export const HERO_COPY = {
  /**
   * Sits above the wordmark. One short breath before the brand name — keep it
   * under ~5 words or it stops reading as a whisper.
   */
  overline: "Printed in small batches",

  /**
   * The statement. Deliberately two lines: the first sets up, the second
   * lands, and they fade in one after the other as the shirt resolves. If you
   * rewrite it, keep the two-part setup/payoff shape — the choreography is
   * built around the pause between them.
   */
  statementLead: "The ink doesn't sit on the cloth.",
  statementTurn: "It sinks in.",

  /**
   * Dry, factual counterweight to the statement above. Specs, not poetry —
   * the contrast is what keeps the statement from sounding precious.
   */
  spec: "Five studies · editions of one hundred · never reprinted",

  /** The nudge at the bottom of the hero. */
  scrollHint: "Keep going",
} as const;
