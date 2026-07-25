# N.O.A.X

Homepage + four routes for the N.O.A.X print label. Next.js (App Router) ·
TypeScript · Tailwind · GSAP/ScrollTrigger · canvas.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Node 18.18+ (Node 20+ recommended). Deploys to Vercel as-is.

## What's on the page (v2)

**Homepage** — hero + a centered, scroll-triggered reveal of the four shapes.
No persistent navbar.

- **Hero.** The brand mark (flower + "N.O.A.X") sits as a faded masthead; the
  shirt is the dominant element beneath it.
  - The shirt renders as **ASCII by default** — no hover needed. An
    always-visible **View** button swaps ASCII ↔ the real photograph; the label
    flips (`View` ⇄ `ASCII`). A simple **arrow** at the far right cycles the
    five print slots.
  - The brand flower is the flat original artwork used as a **screen-blended
    watermark** with feathered (radial-masked) edges — its luminous core glows
    on the dark ground while the near-black petals dissolve into it. The
    wordmark is set in **Jost** and sits **on top** of the flower.
- **Shape reveal.** As you scroll past the hero, the four shapes rise and fade
  in together, centered, and keep a gentle 3D idle float. Each links to its
  page. (Modeled on emergenceprojects.com's reveal — the old scroll-to-navbar
  docking is gone.)

**Routes** — `/about`, `/story`, `/shop`, `/contact`, each a real page (not an
anchor) sharing a minimal header/footer via `PageShell`. `/shop` lists the five
slots.

## The three rendering systems
- **ASCII renderer** (`lib/ascii.ts`, `components/AsciiRenderer.tsx`) — samples
  the shirt to a luminance grid and prints characters, fitted to the stage using
  the font's real advance width. This is the shirt's default state.
- **Scroll reveal** (`components/ShapeReveal.tsx`) — one rAF loop composes each
  shape's scroll-driven entrance (staggered rise + fade) and its idle 3D float
  into a single transform, so the two never fight.
- **Pointillism / stipple** (`lib/stipple.ts`, `lib/noise.ts`,
  `components/ParticleCanvas.tsx`) — **retained but not wired in.** v2 removed it
  from the brand mark; the code is kept intact (it's verified and self-contained)
  so it's a one-line rewire if you want dot-stipple art back anywhere. Delete
  these three files if you'd rather drop it entirely.

## Assets & placeholders — replace these
- `public/shirts/design-1.png` is the real shirt (transparent cutout).
  `design-2..5.png` are the **same image as stand-ins**; drop real cutouts in and
  update `src/data/designs.ts`.
- In `src/data/designs.ts`, **NX-01 "Interference"** is a name/blurb I wrote —
  overwrite it. NX-02..05 read "Forthcoming" until their photos land.
- Shape art lives in `public/shapes/` (star = About, diamond = Shop,
  sphere = Story, triangle = Contact); the flower in `public/brand/flower.png`.

## Fonts
Jost (display / wordmark), Martian Mono (ASCII + technical labels), Archivo
(body) — all via `next/font/google`. Jost is my pick for the "chic minimal sans"
brief; swap it in `src/app/layout.tsx` if you prefer another (e.g. a Fontshare
face like Neue Montreal / General Sans, self-hosted).

## Worth an eye in the browser
Built without a browser here, so please sanity-check: the flower-watermark
brightness under the wordmark (tune `.brand-flower` opacity / blend), hero
vertical rhythm on short viewports, the reveal's ScrollTrigger start/end feel,
and ASCII fit at both resolutions. Reduced-motion is honored throughout.
