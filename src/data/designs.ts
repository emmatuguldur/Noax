export type ColorName = "black" | "white";

/** Swatch names, used for the radio's accessible label and in gallery alt text. */
export const COLOR_LABEL: Record<ColorName, string> = {
  black: "Black",
  white: "White",
};

/**
 * One colourway's photography.
 *
 * `photo` is the front and is the only shot a colourway must have — it is what
 * the hero, the shop grid and the gallery's first frame all read. `back` and
 * `model` are filled in as they land; the gallery renders whichever exist, so a
 * half-photographed colourway degrades to a single frame rather than a broken
 * one.
 */
export interface Colorway {
  color: ColorName;
  photo: string;
  back?: string;
  model?: string;
}

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
  blurb: string;
  /** Cut / silhouette, for the product page's spec list. */
  fit: string;
  /** Long-form copy for the product page. Placeholder — overwrite. */
  description: string;
  /**
   * The colourways this print is made in, in swatch order.
   *
   * The first is the default: it is pre-selected on the product page, and it is
   * the one the hero and the shop grid show. The non-empty tuple type is the
   * guarantee — a design with an empty array would have no image anywhere on
   * the site, and that should not typecheck.
   *
   * A design with a single entry renders no swatch selector at all. CAT. 02 and
   * 03 are the only two cut in a second colour; note that they default to
   * *opposite* colours, which is why the default is positional here rather than
   * a fixed "black first" rule.
   */
  colorways: [Colorway, ...Colorway[]];
}

/**
 * The single image that represents a design outside the product page. The hero
 * and the shop grid both show the default colourway's front view.
 */
export function frontOf(design: Design): string {
  return design.colorways[0].photo;
}

/**
 * The prints cycled by the arrow control in the hero, catalogued like exhibition
 * pieces. The metadata renders as bracketed accession tags.
 *
 * CAT. 01..03 are real, photographed designs. Their titling is still placeholder
 * copy to overwrite — 02 and 03 in particular carry the name "Forthcoming" and
 * an edition of "—" while showing finished photography in two colourways, which
 * reads as a mistake on `/shop` and in the product page's title tag.
 *
 * CAT. 04..05 are reserved slots showing CAT. 01's image until their own
 * photography lands; drop a real image at `public/shirts/design-N.png` and name
 * its `back` and `model` files here, or the gallery silently stays a single
 * frame.
 */
const MEDIUM = "ORGANIC COTTON / 380 GSM";
/** The whole run is cut and printed at the Ulaanbaatar studio. */
const ORIGIN = "Mongolia";

/** Shared by the two reserved slots, so the placeholder reads once. */
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
    /* One colourway: the undyed body with contrast sleeves the description
       below describes. Not made in a second colour, so no swatch renders. */
    colorways: [
      {
        color: "white",
        photo: "/shirts/design-1.png",
        back: "/shirts/design-1-back.png",
        model: "/shirts/design-1-model.png",
      },
    ],
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
    /* White first: this print is sold white by default, and the black is the
       alternate. CAT. 03 is the other way round. */
    colorways: [
      {
        color: "white",
        photo: "/shirts/design-2.png",
        back: "/shirts/design-2-back.png",
        model: "/shirts/design-2-model.png",
      },
      {
        color: "black",
        photo: "/shirts/design-2-switch.png",
        back: "/shirts/design-2-switch-back.png",
        model: "/shirts/design-2-switch-model.png",
      },
    ],
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
    /* Black first here — this print defaults to black and the white is the
       alternate, the reverse of CAT. 02.

       ========================================================================
       TODO(noux): TWO OF THE THREE WHITE SHOTS ARE NOT ON DISK.
       ========================================================================
       `design-3-switch-model.png` exists. `design-3-switch.png` (front) and
       `design-3-switch-back.png` do not, so selecting the white swatch on
       `/shop/nx-03` shows a broken front frame and a broken back thumbnail
       today. The paths are named here so that dropping the two files into
       `public/shirts/` is the whole fix — no code change.

       If you would rather not show a broken swatch in the meantime, delete
       this second colourway entry and the selector disappears on its own. */
    colorways: [
      {
        color: "black",
        photo: "/shirts/design-3.png",
        back: "/shirts/design-3-back.png",
        model: "/shirts/design-3-model.png",
      },
      {
        color: "white",
        photo: "/shirts/design-3-switch.png",
        back: "/shirts/design-3-switch-back.png",
        model: "/shirts/design-3-switch-model.png",
      },
    ],
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
    /* Provisional: this is CAT. 01's image standing in, so it is really CAT.
       01's colour. Correct it when the slot is photographed. */
    colorways: [{ color: "white", photo: "/shirts/design-4.png" }],
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
    /* Provisional — see CAT. 04. */
    colorways: [{ color: "white", photo: "/shirts/design-5.png" }],
    blurb: "Next study in the run — photography to come.",
    ...FORTHCOMING,
  },
];
