export interface Design {
  id: string;
  /** Display name of the print. */
  name: string;
  /** Internal reference, printed on the care label. */
  code: string;
  photo: string;
  blurb: string;
  sizes: string;
}

/**
 * The prints cycled by the arrow control in the hero.
 *
 * Only NX-01 is a real, photographed design right now — its name/blurb are
 * placeholders I wrote and you should overwrite. NX-02..05 are reserved slots
 * showing the NX-01 sample until their own photography lands; drop a real
 * image at the matching `public/shirts/design-N.png` and fill in the copy.
 */
export const DESIGNS: Design[] = [
  {
    id: "interference",
    name: "Interference",
    code: "NX-01",
    photo: "/shirts/design-1.png",
    blurb:
      "Halftone portrait blown to full body width, on an oversized boxy cut with contrast sleeves.",
    sizes: "S–XXL",
  },
  {
    id: "nx-02",
    name: "Forthcoming",
    code: "NX-02",
    photo: "/shirts/design-2.png",
    blurb: "Next print in the run — photography to come.",
    sizes: "S–XXL",
  },
  {
    id: "nx-03",
    name: "Forthcoming",
    code: "NX-03",
    photo: "/shirts/design-3.png",
    blurb: "Next print in the run — photography to come.",
    sizes: "S–XXL",
  },
  {
    id: "nx-04",
    name: "Forthcoming",
    code: "NX-04",
    photo: "/shirts/design-4.png",
    blurb: "Next print in the run — photography to come.",
    sizes: "S–XXL",
  },
  {
    id: "nx-05",
    name: "Forthcoming",
    code: "NX-05",
    photo: "/shirts/design-5.png",
    blurb: "Next print in the run — photography to come.",
    sizes: "S–XXL",
  },
];
