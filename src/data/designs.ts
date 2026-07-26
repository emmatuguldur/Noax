export interface Design {
  id: string;
  /** Kept for alt text / accessible labelling. */
  name: string;
  /** Catalogue number, e.g. "01". */
  cat: string;
  /** Exhibition-style study title, e.g. "INTERFERENCE STUDY". */
  study: string;
  /** Edition line, e.g. "EDITION OF 100". */
  edition: string;
  /** Specification / placard descriptor. */
  spec: string;
  photo: string;
  blurb: string;
}

/**
 * The prints cycled by the arrow control in the hero, catalogued like exhibition
 * pieces. Only CAT. 01 is a real, photographed design right now — its titling is
 * placeholder copy to overwrite. CAT. 02..05 are reserved slots showing the
 * sample until their own photography lands; drop a real image at the matching
 * `public/shirts/design-N.png` and fill in the titling.
 */
export const DESIGNS: Design[] = [
  {
    id: "interference",
    name: "Interference Study",
    cat: "01",
    study: "INTERFERENCE STUDY",
    edition: "EDITION OF 100",
    spec: "SPECIFICATION",
    photo: "/shirts/design-1.png",
    blurb:
      "Halftone portrait blown to full body width, on an oversized boxy cut with contrast sleeves.",
  },
  {
    id: "nx-02",
    name: "Forthcoming",
    cat: "02",
    study: "FORTHCOMING",
    edition: "EDITION —",
    spec: "IN PREPARATION",
    photo: "/shirts/design-2.png",
    blurb: "Next study in the run — photography to come.",
  },
  {
    id: "nx-03",
    name: "Forthcoming",
    cat: "03",
    study: "FORTHCOMING",
    edition: "EDITION —",
    spec: "IN PREPARATION",
    photo: "/shirts/design-3.png",
    blurb: "Next study in the run — photography to come.",
  },
  {
    id: "nx-04",
    name: "Forthcoming",
    cat: "04",
    study: "FORTHCOMING",
    edition: "EDITION —",
    spec: "IN PREPARATION",
    photo: "/shirts/design-4.png",
    blurb: "Next study in the run — photography to come.",
  },
  {
    id: "nx-05",
    name: "Forthcoming",
    cat: "05",
    study: "FORTHCOMING",
    edition: "EDITION —",
    spec: "IN PREPARATION",
    photo: "/shirts/design-5.png",
    blurb: "Next study in the run — photography to come.",
  },
];
