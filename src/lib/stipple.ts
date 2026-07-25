/**
 * Pointillism dot-stipple system.
 *
 * Stochastic halftone: dots are placed by rejection sampling against a weight
 * map derived from the source image, so density follows local brightness
 * rather than sitting on a regular grid. Darker regions accept more samples;
 * lighter regions accept fewer. Accepted samples are then expanded into small
 * gaussian clusters so the texture reads as hand-stippled rather than as
 * uniform blue noise.
 *
 * Used for the flower brand mark and any other decorative dot illustration.
 * It is NOT the T-shirt renderer — that is `lib/ascii.ts`.
 */

import { mulberry32 } from "./noise";

export interface StippleDot {
  /** Final position, in CSS pixels relative to the canvas box. */
  tx: number;
  ty: number;
  /** Scattered start position used by the assemble animation. */
  sx: number;
  sy: number;
  radius: number;
  /** Pre-built, quantised `rgba(...)` string so fillStyle changes batch well. */
  style: string;
  /** Stable noise coordinates for idle drift. */
  nx: number;
  ny: number;
  /** 0..1 stagger offset for the assemble animation. */
  delay: number;
}

export interface StippleOptions {
  /** Target dot count. Around 3500–6000 reads well at brand-mark size. */
  count: number;
  /** Width of the internal sampling buffer. Higher = finer detail, slower build. */
  sampleWidth: number;
  /** Source alpha below this is treated as empty. */
  alphaCut: number;
  minRadius: number;
  maxRadius: number;
  /** 0..1 chance an accepted sample spawns 2–3 dots instead of 1. */
  clusterChance: number;
  /** How strongly saturated source pixels keep their own hue. */
  satBoost: number;
  /** Ink colour for desaturated source pixels. */
  ink: [number, number, number];
  seed: number;
}

export const DEFAULT_STIPPLE: StippleOptions = {
  count: 4600,
  sampleWidth: 340,
  alphaCut: 0.22,
  minRadius: 0.55,
  maxRadius: 2.4,
  clusterChance: 0.55,
  satBoost: 2.4,
  ink: [237, 233, 226],
  seed: 7,
};

interface WeightField {
  width: number;
  height: number;
  weight: Float32Array;
  darkness: Float32Array;
  saturation: Float32Array;
  rgb: Float32Array;
  maxWeight: number;
}

/** Reads an image into a normalised weight field. */
function buildWeightField(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  opts: StippleOptions,
): WeightField | null {
  const width = Math.max(8, Math.round(opts.sampleWidth));
  const height = Math.max(8, Math.round((width * srcHeight) / srcWidth));

  const buffer = document.createElement("canvas");
  buffer.width = width;
  buffer.height = height;
  const ctx = buffer.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, width, height).data;
  } catch {
    // Cross-origin source: canvas is tainted and unreadable.
    return null;
  }

  const n = width * height;
  const darkness = new Float32Array(n);
  const saturation = new Float32Array(n);
  const alpha = new Float32Array(n);
  const rgb = new Float32Array(n * 3);
  const histogram = new Uint32Array(256);
  let inside = 0;

  for (let i = 0; i < n; i += 1) {
    const o = i * 4;
    const r = data[o] / 255;
    const g = data[o + 1] / 255;
    const b = data[o + 2] / 255;
    const a = data[o + 3] / 255;

    rgb[i * 3] = r;
    rgb[i * 3 + 1] = g;
    rgb[i * 3 + 2] = b;
    alpha[i] = a;

    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const dark = 1 - lum;
    darkness[i] = dark;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    saturation[i] = max > 1e-4 ? (max - min) / max : 0;

    if (a >= opts.alphaCut) {
      histogram[Math.min(255, (dark * 255) | 0)] += 1;
      inside += 1;
    }
  }

  if (inside === 0) return null;

  // Percentile stretch across the darkness actually present inside the
  // silhouette. Without this, near-black artwork flattens to one density.
  const lowTarget = inside * 0.03;
  const highTarget = inside * 0.97;
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
  const lo = low / 255;
  const span = Math.max(high / 255 - lo, 1e-3);

  const weight = new Float32Array(n);
  let maxWeight = 0;
  for (let i = 0; i < n; i += 1) {
    if (alpha[i] < opts.alphaCut) {
      darkness[i] = 0;
      continue;
    }
    const norm = Math.min(1, Math.max(0, (darkness[i] - lo) / span));
    darkness[i] = norm;
    // A saturation-driven floor keeps bright-but-vivid areas (the flower's
    // core) dense, instead of letting the spec's darkness rule hollow them out.
    const floor = 0.16 + 0.52 * saturation[i];
    const w = alpha[i] * (floor + (1 - floor) * norm);
    weight[i] = w;
    if (w > maxWeight) maxWeight = w;
  }

  return { width, height, weight, darkness, saturation, rgb, maxWeight };
}

function quantise(v: number, step: number): number {
  return Math.round(v / step) * step;
}

/**
 * Samples `source` into a dot list sized for a `boxWidth × boxHeight` canvas.
 * Returns dots pre-sorted by fill style so the draw loop changes `fillStyle`
 * a few dozen times per frame rather than a few thousand.
 */
export function buildStipple(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  boxWidth: number,
  boxHeight: number,
  options: Partial<StippleOptions> = {},
): StippleDot[] {
  const opts: StippleOptions = { ...DEFAULT_STIPPLE, ...options };
  const field = buildWeightField(source, srcWidth, srcHeight, opts);
  if (!field) return [];

  const { width, height, weight, darkness, saturation, rgb, maxWeight } = field;
  const rand = mulberry32(opts.seed);
  const dots: StippleDot[] = [];
  const scale = boxWidth / 380;
  const cx = boxWidth / 2;
  const cy = boxHeight / 2;
  const [inkR, inkG, inkB] = opts.ink;

  let attempts = 0;
  const attemptLimit = opts.count * 400;

  while (dots.length < opts.count && attempts < attemptLimit) {
    attempts += 1;
    const px = (rand() * width) | 0;
    const py = (rand() * height) | 0;
    const idx = py * width + px;
    const w = weight[idx];
    if (w <= 0 || rand() > w / maxWeight) continue;

    const dark = darkness[idx];
    const sat = saturation[idx];

    // Desaturated source pixels become brand ink; saturated ones keep their
    // own hue, lifted to full value so the flower's core still burns.
    const mix = Math.min(1, sat * opts.satBoost);
    const sr = rgb[idx * 3];
    const sg = rgb[idx * 3 + 1];
    const sb = rgb[idx * 3 + 2];
    const peak = Math.max(sr, sg, sb);
    const lift = peak > 0.02 ? 1 / peak : 1;
    const r = quantise(255 * ((1 - mix) * (inkR / 255) + mix * sr * lift), 16);
    const g = quantise(255 * ((1 - mix) * (inkG / 255) + mix * sg * lift), 16);
    const b = quantise(255 * ((1 - mix) * (inkB / 255) + mix * sb * lift), 16);
    const alpha = quantise(0.34 + 0.66 * Math.max(dark, sat), 0.125);
    const style = `rgba(${r},${g},${b},${alpha})`;

    const baseX = ((px + rand()) / width) * boxWidth;
    const baseY = ((py + rand()) / height) * boxHeight;
    const sigma = (0.9 + 1.8 * (1 - dark)) * scale;
    const members = rand() > opts.clusterChance ? 1 : rand() > 0.5 ? 2 : 3;

    for (let k = 0; k < members && dots.length < opts.count; k += 1) {
      // Box–Muller for the cluster spread.
      const u1 = Math.max(1e-6, rand());
      const u2 = rand();
      const mag = Math.sqrt(-2 * Math.log(u1));
      const tx = baseX + mag * Math.cos(2 * Math.PI * u2) * sigma;
      const ty = baseY + mag * Math.sin(2 * Math.PI * u2) * sigma;

      // Scatter start: pushed outward from centre so the mark condenses inward.
      const angle = rand() * Math.PI * 2;
      const throw_ = 0.55 + rand() * 0.85;
      const sx = cx + (tx - cx) * (1 + throw_) + Math.cos(angle) * 60 * scale;
      const sy = cy + (ty - cy) * (1 + throw_) + Math.sin(angle) * 60 * scale;

      dots.push({
        tx,
        ty,
        sx,
        sy,
        radius:
          (opts.minRadius + (opts.maxRadius - opts.minRadius) * dark) *
          scale *
          (0.75 + 0.5 * rand()),
        style,
        nx: tx * 0.012,
        ny: ty * 0.012,
        delay: rand() * 0.55,
      });
    }
  }

  dots.sort((a, b) => (a.style < b.style ? -1 : a.style > b.style ? 1 : 0));
  return dots;
}
