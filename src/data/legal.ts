/**
 * ============================================================================
 * TODO(noux): EVERY `null` BELOW IS A REQUIRED FACT. FILL THEM BEFORE LAUNCH.
 * ============================================================================
 *
 * The details `/terms` and `/privacy` both need, in one place so a change lands
 * in both documents at once.
 *
 * `null` means nobody has told me this yet. `LegalBlank` renders those as a
 * visible ember-marked gap in the page instead of guessing — a document that is
 * meant to bind you must not ship with an invented company name or a registered
 * address I made up. Fill the value in here and the blank disappears from both
 * pages.
 *
 * Both pages carry `robots: { index: false }` while any of these are `null`.
 * That comes off in the same commit as the last one.
 *
 * A note on scope, because it is not something a value in this file can fix:
 * the text these pages carry is written for Mongolian law and domestic delivery
 * only — Ulaanbaatar and the aimags. It says nothing about shipping abroad,
 * customs, or the rights of a buyer in the EU or UK. The site is in English and
 * the shop takes cards, so if you sell outside Mongolia that gap is real and a
 * lawyer, not this file, has to close it.
 */

/** A fact that may not be known yet. `null` renders as a blank in the page. */
type Fact = string | null;

interface LegalFacts {
  /** Bump this whenever either document's text changes. */
  lastUpdated: string;
  /** Registered company name — the party the customer actually contracts with. */
  entity: Fact;
  /** Registered office, as it appears on the company registration. */
  registeredAddress: Fact;
  /** Public-facing studio or store address for the contact sections. */
  storeAddress: Fact;
  /** The domain the privacy policy names as "the Site". */
  siteUrl: Fact;
  /** Where personal data physically lives — your host's region, not the studio. */
  dataLocation: Fact;
  /** Quoted delivery window inside Ulaanbaatar, in hours. */
  deliveryUlaanbaatar: Fact;
  /** Quoted delivery window to the aimags, in business days. */
  deliveryAimags: Fact;
  /** Reachable published number. Only the privacy policy asks for one. */
  phone: Fact;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
}

export const LEGAL: LegalFacts = {
  lastUpdated: "5 August 2026",

  entity: null,
  registeredAddress: null,
  storeAddress: null,
  siteUrl: null,
  dataLocation: null,
  deliveryUlaanbaatar: null,
  deliveryAimags: null,
  phone: null,

  /* These match `FOOTER_COPY.columns` in `copy.ts` and, as of the NOUX rename,
     `/contact` and the add-to-cart note too — those two used to advertise a
     second, different pair (`hi@noax.mn`, `instagram.com/noax`), so one of them
     was always wrong. One pair site-wide now.

     The address keeps the old spelling on purpose: it is a real Gmail account,
     and a Gmail address cannot be renamed. The Instagram handle *was* renamed,
     because that one can be. */
  email: "noaxthebest@gmail.com",
  instagramHandle: "@nouxthebest",
  instagramUrl: "https://instagram.com/nouxthebest",
};
