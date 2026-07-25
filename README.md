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
  - The brand flower is the flat original artwork as a faint **inverted
    watermark** (`filter: invert(1)`, low opacity) with feathered (radial-masked)
    edges. The artwork is near-black, so on the dark ground inverting is what
    makes the whole flower read as a soft watermark rather than vanishing (a
    screen/brightness lift only showed the bright core). The **Jost** wordmark
    sits **on top**, sized as a modest masthead over the larger shirt.
- **Shapes.** On load the four shapes sit **scattered around the shirt** at
  loose hero positions. As you scroll past the hero they **scrub into a centered
  row** ("Four ways in"), labels fading in as they line up — the row is the
  scroll destination, not a static section, and not a docked navbar. Each shape
  links to its page. (Modeled on emergenceprojects.com.) They live on a fixed
  overlay (`ShapeField`) driven by one rAF loop; a `.shape-spacer` provides the
  scroll distance.

**Routes** — `/about`, `/story`, `/shop`, `/contact`, each a real page (not an
anchor) sharing a minimal header/footer via `PageShell`. `/shop` lists the five
slots.

## The three rendering systems
- **ASCII renderer** (`lib/ascii.ts`, `components/AsciiRenderer.tsx`) — samples
  the shirt to a luminance grid and prints characters, fitted to the stage using
  the font's real advance width. This is the shirt's default state. While the
  ASCII is showing and the stage is hovered, it **drifts toward the cursor** —
  eased/lagged (a small ~16px offset), so the motion is subtle, not 1:1. Photo
  mode and reduced-motion don't drift.
- **Shape convergence** (`components/ShapeField.tsx`) — a fixed overlay whose
  rAF loop interpolates each shape from its hero-scatter anchor to its centered
  row slot by scroll progress, composing the idle 3D float into the same
  transform so the two never fight.
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

---

## v4 — atmosphere pass

- **Flower, fixed for real.** It kept disappearing because the brand mark had no
  stacking context, so the flower's negative `z-index` resolved against the root
  and the opaque page background painted over it. The mark now isolates its own
  stacking context and the flower sits at `z-index: 0` — the faint inverted
  watermark is finally visible behind the wordmark.
- **Film grain** (`components/GrainOverlay.tsx`) — a fixed, full-viewport canvas
  tiling a small noise pattern that regenerates a few times a second, at ~5%
  opacity, so the whole page reads as printed rather than flat. Static under
  reduced-motion.
- **Quote section** (`components/QuoteSection.tsx`) — a full-bleed section after
  the hero: one line of (placeholder) copy in a display serif (Instrument
  Serif), centered with generous space, wrapped in an **organic arch frame** —
  the one non-rectangular framing device in the layout.
- **Ambient shapes** (`components/AmbientField.tsx`) — small, faint stipple
  shapes drifting behind the hero and quote, reusing the pointillism system
  (`ParticleCanvas`). Purely decorative — no links, no labels. Capped per screen
  size since each is a live canvas.
- **Shapes now assemble, then depart.** `ShapeField` is rewritten to read scroll
  position directly (no ScrollTrigger): the shapes converge from their hero
  scatter into the centered row, hold, then the whole row lifts and fades as you
  continue — clearing the space for the quote section instead of sitting fixed
  over it.
- **Accent stays restrained.** No new colours: grain is grey, ambient/arch/quote
  are paper and ash, the flower is the inverted original. Ember remains reserved
  for interactive states.
