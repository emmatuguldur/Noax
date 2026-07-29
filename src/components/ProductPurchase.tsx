"use client";

import { useState } from "react";

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

/**
 * Size selection and the cart control, together because the note under the
 * button reports whichever thing is currently in the way.
 *
 * These are real radios inside a `fieldset`, visually hidden and drawn as
 * boxes. A row of `<button>`s would have looked identical and been wrong:
 * radios give single-selection, arrow-key movement within the group and the
 * right announcement to a screen reader for free, none of which is worth
 * hand-rolling on a control this small.
 *
 * Stock is not modelled — every size is offered. When inventory exists, the
 * unavailable ones want `disabled` on the input, not a missing box.
 */
export default function ProductPurchase() {
  const [size, setSize] = useState<string | null>(null);

  return (
    <>
      <fieldset className="size-field">
        <legend className="size-legend">Size</legend>
        <div className="size-row">
          {SIZES.map((s) => (
            <label key={s} className={size === s ? "size-opt size-opt-on" : "size-opt"}>
              <input
                type="radio"
                name="size"
                value={s}
                checked={size === s}
                onChange={() => setSize(s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Present and styled, but there is no cart behind it, so it stays
          `aria-disabled` and the line below says what is actually missing —
          first a size, then the checkout that doesn't exist yet. */}
      <button type="button" className="product-cart" aria-disabled="true">
        Add to cart
      </button>

      <p className="product-note" aria-live="polite">
        {size ? (
          <>
            Checkout is not live yet — write to{" "}
            <a className="product-note-link" href="mailto:hi@noax.mn">
              hi@noax.mn
            </a>{" "}
            to reserve one.
          </>
        ) : (
          "Choose a size to continue."
        )}
      </p>
    </>
  );
}
