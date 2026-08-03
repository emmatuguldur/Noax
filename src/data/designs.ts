export interface Design {
  id: string;
  /** Kept for alt text / accessible labelling. */
  name: string;
  /** Catalogue number, e.g. "01". */
  cat: string;
  /** Exhibition-style study title (data only, e.g. for alt text). */
  study: string;
  /** Edition line, accession style, e.g. "1/100" or "—". */
  edition: string;
  /** Material / medium, e.g. "ORGANIC COTTON / 380 GSM". */
  medium: string;
  /** Where it's made. Same for the whole run today; kept per-design anyway. */
  origin: string;
  /** Front view. The only image every slot is guaranteed to have. */
  photo: string;
  blurb: string;
  /** Cut / silhouette, for the product page's spec list. */
  fit: string;
  /** Long-form copy for the product page. Placeholder — overwrite. */
  description: string;
  /**
   * Extra views for the product gallery, both optional: only CAT. 01 has been
   * photographed. The gallery renders whatever exists, so a slot with neither
   * simply shows its front view alone rather than a broken frame.
   */
  back?: string;
  model?: string;
}

/**
 * The prints cycled by the arrow control in the hero, catalogued like exhibition
 * pieces. The metadata renders as bracketed accession tags. Only CAT. 01 is a
 * real, photographed design right now — its titling is placeholder copy to
 * overwrite. CAT. 02..05 are reserved slots showing the sample until their own
 * photography lands; drop a real image at `public/shirts/design-N.png`.
 */
const MEDIUM = "ORGANIC COTTON / 380 GSM";
/** The whole run is cut and printed at the Ulaanbaatar studio. */
const ORIGIN = "Mongolia";

/** Shared by the four reserved slots, so the placeholder reads once. */
const FORTHCOMING = {
  origin: ORIGIN,
  fit: "—",
  description:
    "Specification follows the photography. The cut, the weight and the edition size are fixed; the print is not finished being argued with.",
} as const;

export const DESIGNS: Design[] = [
  {
    id: "interference",
    name: "Interference Study",
    cat: "01",
    study: "INTERFERENCE STUDY",
    edition: "1/100",
    medium: MEDIUM,
    origin: ORIGIN,
    photo: "/shirts/design-1.png",
    back: "/shirts/design-1-back.png",
    model: "/shirts/design-1-model.png",
    blurb:
      "Halftone portrait blown to full body width, on an oversized boxy cut with contrast sleeves.",
    fit: "Oversized / boxy",
    description:
      "A halftone portrait pushed past the point where it resolves, printed at full body width so the dot structure is the subject rather than the face. Water-based ink, so it sits in the fibre instead of on top of it — the print will soften with the shirt rather than crack away from it. Contrast sleeves in washed black against an undyed body.",
  },
  {
    id: "nx-02",
    name: "Forthcoming",
    cat: "02",
    study: "FORTHCOMING",
    edition: "—",
    medium: MEDIUM,
    photo: "/shirts/design-2.png",
    blurb: "Next study in the run — photography to come.",
    ...FORTHCOMING,
  },
  {
    id: "nx-03",
    name: "Forthcoming",
    cat: "03",
    study: "FORTHCOMING",
    edition: "—",
    medium: MEDIUM,
    photo: "/shirts/design-3.png",
    blurb: "Next study in the run — photography to come.",
    ...FORTHCOMING,
  },
  {
    id: "nx-04",
    name: "Forthcoming",
    cat: "04",
    study: "FORTHCOMING",
    edition: "—",
    medium: MEDIUM,
    photo: "/shirts/design-4.png",
    blurb: "Next study in the run — photography to come.",
    ...FORTHCOMING,
  },
  {
    id: "nx-05",
    name: "Forthcoming",
    cat: "05",
    study: "FORTHCOMING",
    edition: "—",
    medium: MEDIUM,
    photo: "/shirts/design-5.png",
    blurb: "Next study in the run — photography to come.",
    ...FORTHCOMING,
  },
];
