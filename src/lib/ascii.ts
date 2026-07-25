/**
 * ASCII text-character rendering system.
 *
 * Deliberately separate from the stipple sampler. This one samples a source
 * image into a grid of cells and maps each cell's average brightness onto a
 * density ramp, producing literal monospace characters that get painted into
 * a `<pre>` — not dots, not a canvas effect.
 */

export const ASCII_RAMP = " .:-=+*#%@";

/** Nominal advance-width / font-size ratio for a monospace face. */
export const FALLBACK_ADVANCE = 0.6;

export interface AsciiGrid {
  cols: number;
  rows: number;
  /** Advance ratio the grid was built against; reuse it when sizing the type. */
  advance: number;
  /** Flat `cols * rows` string, no newlines. */
  chars: string;
  /** Per-cell reveal threshold in 0..1, for the type-on stagger. */
  delays: Float32Array;
}

export interface AsciiOptions {
  cols: number;
  ramp: string;
  /** Advance-to-line-height ratio, used to keep the grid square-ish. */
  advance: number;
  lineHeight: number;
  /** <1 brightens the mid-tones, >1 darkens them. */
  gamma: number;
  /** Percentile stretch so dark garments on a dark stage still resolve. */
  autoLevels: boolean;
  seed: number;
}

export const DEFAULT_ASCII: AsciiOptions = {
  cols: 104,
  ramp: ASCII_RAMP,
  advance: FALLBACK_ADVANCE,
  lineHeight: 1,
  gamma: 1,
  autoLevels: true,
  seed: 21,
};

/**
 * Measures the real advance-width ratio of a monospace stack so the grid can
 * be sized against the font that will actually render it.
 */
export function measureAdvanceRatio(fontFamily: string): number {
  if (typeof document === "undefined") return FALLBACK_ADVANCE;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return FALLBACK_ADVANCE;
  const probe = 100;
  ctx.font = `${probe}px ${fontFamily}`;
  const width = ctx.measureText("M".repeat(10)).width / 10 / probe;
  if (!Number.isFinite(width) || width <= 0.1 || width > 1.5) return FALLBACK_ADVANCE;
  return width;
}

/** Rows needed to keep the source aspect ratio under a given cell shape. */
export function rowsForAspect(cols: number, aspect: number, opts: AsciiOptions): number {
  return Math.max(1, Math.round(cols * aspect * (opts.advance / opts.lineHeight)));
}

/**
 * Samples an image into a character grid. Runs once per source image; the
 * result is cheap to re-compose every frame during the reveal.
 */
export function buildAsciiGrid(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  options: Partial<AsciiOptions> = {},
): AsciiGrid | null {
  const opts: AsciiOptions = { ...DEFAULT_ASCII, ...options };
  const cols = Math.max(8, Math.round(opts.cols));
  const rows = rowsForAspect(cols, srcHeight / srcWidth, opts);

  const buffer = document.createElement("canvas");
  buffer.width = cols;
  buffer.height = rows;
  const ctx = buffer.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.clearRect(0, 0, cols, rows);
  ctx.drawImage(source, 0, 0, cols, rows);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, cols, rows).data;
  } catch {
    return null;
  }

  const n = cols * rows;
  const brightness = new Float32Array(n);
  const histogram = new Uint32Array(256);

  for (let i = 0; i < n; i += 1) {
    const o = i * 4;
    const lum =
      (0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2]) / 255;
    const value = lum * (data[o + 3] / 255);
    brightness[i] = value;
    histogram[Math.min(255, (value * 255) | 0)] += 1;
  }

  let lo = 0;
  let span = 1;
  if (opts.autoLevels) {
    const lowTarget = n * 0.02;
    const highTarget = n * 0.98;
    let running = 0;
    let low = 0;
    let high = 255;
    for (let v = 0; v < 256; v += 1) {
      running += histogram[v];
      if (running <= lowTarget) low = v;
      if (running >= highTarget) {
        high = v;
        break;
      }
    }
    lo = low / 255;
    span = Math.max(high / 255 - lo, 1e-3);
  }

  const ramp = opts.ramp;
  const last = ramp.length - 1;
  const chars = new Array<string>(n);
  const delays = new Float32Array(n);

  // Reveal order: a left-to-right wipe with enough scatter to read as typing.
  let seed = opts.seed >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const i = y * cols + x;
      let value = (brightness[i] - lo) / span;
      value = value < 0 ? 0 : value > 1 ? 1 : value;
      if (opts.gamma !== 1) value = Math.pow(value, opts.gamma);
      chars[i] = ramp[Math.min(last, Math.round(value * last))];
      delays[i] = 0.55 * (x / cols) + 0.45 * rand();
    }
  }

  return { cols, rows, advance: opts.advance, chars: chars.join(""), delays };
}

/**
 * Builds the printable string for a given reveal progress. Cells whose delay
 * has not been reached yet render as blanks, which is what produces the
 * type-on stagger.
 */
export function composeAscii(grid: AsciiGrid, reveal: number): string {
  const { cols, rows, chars, delays } = grid;
  if (reveal >= 1) {
    const lines: string[] = [];
    for (let y = 0; y < rows; y += 1) lines.push(chars.slice(y * cols, y * cols + cols));
    return lines.join("\n");
  }

  const out: string[] = [];
  for (let y = 0; y < rows; y += 1) {
    let line = "";
    for (let x = 0; x < cols; x += 1) {
      const i = y * cols + x;
      line += delays[i] <= reveal ? chars[i] : " ";
    }
    out.push(line);
  }
  return out.join("\n");
}
