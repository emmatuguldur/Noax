"use client";

import { COLOR_LABEL, type Colorway } from "@/data/designs";

interface ColorSelectProps {
  colorways: Colorway[];
  /** Index into `colorways`. */
  selected: number;
  onSelect: (index: number) => void;
}

/**
 * The colourway swatches, sitting directly above the size selector.
 *
 * Built the same way as `ProductPurchase`'s sizes and for the same reason: real
 * radios in a `fieldset`, visually hidden and drawn as circles. That buys single
 * selection, arrow-key movement within the group and the correct screen-reader
 * announcement without hand-rolling any of it — which matters more here than on
 * the sizes, because the visible control is a coloured dot with no text in it.
 * The name comes from `aria-label` on the input; the wrapping label has nothing
 * readable inside it to borrow.
 *
 * Selected is the ember ring, the same signal `.size-opt-on` and
 * `.product-thumb-on` already use for "this is the one you're on". The ring sits
 * on the 44px box rather than on the dot, so the accent never touches the colour
 * it is describing.
 */
export default function ColorSelect({ colorways, selected, onSelect }: ColorSelectProps) {
  return (
    <fieldset className="color-field">
      <legend className="color-legend">Colour</legend>
      <div className="color-row">
        {colorways.map((c, i) => (
          <label
            key={c.color}
            className={i === selected ? "color-opt color-opt-on" : "color-opt"}
          >
            <input
              type="radio"
              name="colorway"
              value={c.color}
              checked={i === selected}
              onChange={() => onSelect(i)}
              aria-label={COLOR_LABEL[c.color]}
            />
            <span className="color-dot" data-color={c.color} aria-hidden="true" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
