import { createNoise2D } from "@/lib/noise";

/**
 * Draws an animated "cutting through fabric" backdrop behind the shape row:
 * a scissors icon travels a straight pass edge-to-edge, leaving a jagged,
 * frayed slit (two parted edges either side of a dark gap, with small
 * frizz ticks for loose thread), then fades and starts again from a new
 * edge. Five passes cycle: left→right, top→bottom, top-right→bottom-left,
 * top-left→bottom-right, bottom→top.
 *
 * Positions are fractions of the canvas so it holds up across resizes. All
 * geometry math happens in CSS pixels — callers must `ctx.scale(dpr, dpr)`
 * first and pass CSS-pixel width/height/rects.
 */

interface Pt {
  x: number;
  y: number;
}

interface Pass {
  from: Pt;
  to: Pt;
}

const PASSES: Pass[] = [
  { from: { x: 0, y: 0.5 }, to: { x: 1, y: 0.5 } }, // left -> right
  { from: { x: 0.5, y: 0 }, to: { x: 0.5, y: 1 } }, // top -> bottom
  { from: { x: 1, y: 0 }, to: { x: 0, y: 1 } }, // top-right -> bottom-left
  { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }, // top-left -> bottom-right
  { from: { x: 0.4, y: 1 }, to: { x: 0.4, y: 0 } }, // bottom -> top
];

const TRAVEL_MS = 2600;
const PAUSE_MS = 800;
const SEG_LEN = 15;
const JAG_AMP = 3;
const FRIZZ_EVERY = 3;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function pointInRect(p: Pt, r: DOMRect): boolean {
  return p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
}

export class CuttingAnimator {
  private noise = createNoise2D(4177);
  private passIndex = 0;
  private passStart: number | null = null;
  private weaveTile: HTMLCanvasElement | null = null;
  private weavePattern: CanvasPattern | null = null;

  draw(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    now: number,
    exclude: DOMRect | null,
    intensity: number,
    reduced: boolean,
  ): void {
    if (reduced) {
      this.drawWeave(ctx, w, h, exclude, 0.045);
      return;
    }
    if (intensity <= 0.01) return;

    this.drawWeave(ctx, w, h, exclude, 0.035 * intensity);

    if (this.passStart === null) this.passStart = now;
    let elapsed = now - this.passStart;
    if (elapsed > TRAVEL_MS + PAUSE_MS) {
      this.passIndex = (this.passIndex + 1) % PASSES.length;
      this.passStart = now;
      elapsed = 0;
    }

    const traveling = elapsed <= TRAVEL_MS;
    const rawProgress = traveling ? elapsed / TRAVEL_MS : 1;
    const progress = easeInOutCubic(Math.min(1, rawProgress));
    const fade = traveling ? 1 : Math.max(0, 1 - (elapsed - TRAVEL_MS) / PAUSE_MS);
    const alpha = intensity * fade;
    if (alpha <= 0.01) return;

    const pass = PASSES[this.passIndex];
    const from = { x: pass.from.x * w, y: pass.from.y * h };
    const to = { x: pass.to.x * w, y: pass.to.y * h };
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const dist = Math.hypot(to.x - from.x, to.y - from.y) * progress;
    const tip = { x: from.x + Math.cos(angle) * dist, y: from.y + Math.sin(angle) * dist };

    ctx.save();
    if (exclude) this.clipExclude(ctx, w, h, exclude);
    this.drawCutLine(ctx, from, angle, dist, alpha, this.passIndex);
    ctx.restore();

    if (!exclude || !pointInRect(tip, exclude)) {
      this.drawScissors(ctx, tip, angle, alpha, now);
    }
  }

  private clipExclude(ctx: CanvasRenderingContext2D, w: number, h: number, rect: DOMRect): void {
    const pad = 26;
    const radius = 18;
    const rx = rect.left - pad;
    const ry = rect.top - pad;
    const rw = rect.width + pad * 2;
    const rh = rect.height + pad * 2;

    const path = new Path2D();
    path.rect(0, 0, w, h);
    path.moveTo(rx + radius, ry);
    path.arcTo(rx + rw, ry, rx + rw, ry + rh, radius);
    path.arcTo(rx + rw, ry + rh, rx, ry + rh, radius);
    path.arcTo(rx, ry + rh, rx, ry, radius);
    path.arcTo(rx, ry, rx + rw, ry, radius);
    path.closePath();
    ctx.clip(path, "evenodd");
  }

  private drawCutLine(
    ctx: CanvasRenderingContext2D,
    from: Pt,
    angle: number,
    dist: number,
    alpha: number,
    seed: number,
  ): void {
    if (dist < 1) return;
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const steps = Math.max(1, Math.floor(dist / SEG_LEN));
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const d = Math.min(dist, i * SEG_LEN);
      const bx = from.x + cosA * d;
      const by = from.y + sinA * d;
      const jag = this.noise(seed * 11 + i * 0.5, 3.2) * JAG_AMP;
      pts.push({ x: bx + nx * jag, y: by + ny * jag });
    }
    if (pts.length < 2) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // dark parted gap
    ctx.beginPath();
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.strokeStyle = `rgba(11, 11, 12, ${0.55 * alpha})`;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // paper-toned edges flanking the gap
    for (const side of [-1, 1]) {
      ctx.beginPath();
      pts.forEach((p, i) => {
        const x = p.x + nx * side * 1.6;
        const y = p.y + ny * side * 1.6;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = `rgba(237, 233, 226, ${0.18 * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // frayed thread ticks
    ctx.strokeStyle = `rgba(237, 233, 226, ${0.22 * alpha})`;
    ctx.lineWidth = 1;
    pts.forEach((p, i) => {
      if (i % FRIZZ_EVERY !== 0) return;
      const n = this.noise(seed * 7 + i, 9.9);
      const len = 3 + Math.abs(n) * 4;
      const side = n > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + nx * side * len, p.y + ny * side * len);
      ctx.stroke();
    });
  }

  private drawScissors(
    ctx: CanvasRenderingContext2D,
    tip: Pt,
    angle: number,
    alpha: number,
    now: number,
  ): void {
    const snip = (Math.sin(now / 130) + 1) / 2;
    const openAngle = 0.12 + snip * 0.24;
    const bladeLen = 15;
    const bladeWidth = 3.4;

    ctx.save();
    ctx.translate(tip.x, tip.y);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(237, 233, 226, ${0.85 * alpha})`;
    ctx.strokeStyle = `rgba(11, 11, 12, ${0.4 * alpha})`;
    ctx.lineWidth = 0.6;

    for (const side of [-1, 1]) {
      ctx.save();
      ctx.rotate(side * openAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(bladeLen, side * bladeWidth * 0.25);
      ctx.lineTo(bladeLen * 0.35, side * bladeWidth);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 96, 26, ${0.9 * alpha})`;
    ctx.fill();

    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(-9, side * 4.5, 4.2, 3, side * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(237, 233, 226, ${0.55 * alpha})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    ctx.restore();
  }

  private ensureWeaveTile(): void {
    if (this.weaveTile || typeof document === "undefined") return;
    const size = 10;
    const tile = document.createElement("canvas");
    tile.width = size;
    tile.height = size;
    const tctx = tile.getContext("2d");
    if (!tctx) return;
    tctx.strokeStyle = "rgba(237, 233, 226, 0.5)";
    tctx.lineWidth = 1;
    tctx.beginPath();
    tctx.moveTo(0, size);
    tctx.lineTo(size, 0);
    tctx.stroke();
    tctx.beginPath();
    tctx.moveTo(0, 0);
    tctx.lineTo(size, size);
    tctx.stroke();
    this.weaveTile = tile;
  }

  private drawWeave(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    exclude: DOMRect | null,
    opacity: number,
  ): void {
    if (opacity <= 0.002) return;
    this.ensureWeaveTile();
    if (!this.weavePattern && this.weaveTile) {
      this.weavePattern = ctx.createPattern(this.weaveTile, "repeat");
    }
    if (!this.weavePattern) return;

    ctx.save();
    if (exclude) this.clipExclude(ctx, w, h, exclude);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = this.weavePattern;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
