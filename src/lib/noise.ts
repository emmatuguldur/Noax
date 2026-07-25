/**
 * Deterministic RNG + 2D simplex noise.
 *
 * Both the stipple sampler and the idle drift need to be reproducible so a
 * re-render (resize, remount) lands on the same illustration instead of
 * reshuffling every dot.
 */

/** Small, fast, seeded PRNG. Returns a function producing [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Eight unit-length gradients, as x/y pairs.
const D = Math.SQRT1_2;
const GRAD2 = [1, 0, -1, 0, 0, 1, 0, -1, D, D, -D, D, D, -D, -D, -D];

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

/**
 * Builds a 2D simplex noise function. Output is roughly [-1, 1] and is
 * clamped, so callers can treat it as a bounded signed offset.
 */
export function createNoise2D(seed = 1337): (x: number, y: number) => number {
  const rand = mulberry32(seed);
  const source = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) source[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = source[i];
    source[i] = source[j];
    source[j] = tmp;
  }

  const perm = new Uint8Array(512);
  const gradIndex = new Uint8Array(512);
  for (let i = 0; i < 512; i += 1) {
    perm[i] = source[i & 255];
    gradIndex[i] = perm[i] & 7;
  }

  return function noise2D(xin: number, yin: number): number {
    const skew = (xin + yin) * F2;
    const i = Math.floor(xin + skew);
    const j = Math.floor(yin + skew);
    const unskew = (i + j) * G2;
    const x0 = xin - (i - unskew);
    const y0 = yin - (j - unskew);

    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let total = 0;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) {
      const g = gradIndex[ii + perm[jj]] * 2;
      t0 *= t0;
      total += t0 * t0 * (GRAD2[g] * x0 + GRAD2[g + 1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) {
      const g = gradIndex[ii + i1 + perm[jj + j1]] * 2;
      t1 *= t1;
      total += t1 * t1 * (GRAD2[g] * x1 + GRAD2[g + 1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) {
      const g = gradIndex[ii + 1 + perm[jj + 1]] * 2;
      t2 *= t2;
      total += t2 * t2 * (GRAD2[g] * x2 + GRAD2[g + 1] * y2);
    }

    const v = 70 * total;
    return v < -1 ? -1 : v > 1 ? 1 : v;
  };
}
