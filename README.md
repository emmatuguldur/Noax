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
  sphere = Story, triangle = Contact).
- `public/brand/flower.png` is **no longer used** — v10 took the watermark out
  from behind the wordmark. The file is left on disk in case it comes back;
  nothing references it.
- Decor lives in `public/decor/`: `cobweb-1.png` (the fine orb web, top-right
  of the hero), `cobweb-2.png` (the wide drape, top-left) and
  `spider-hanging.png` (in the shape section, not the hero). Swapping any of
  these means re-checking the geometry constants in the CSS — the placement
  math is measured off these exact files' alpha channels.

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

---

## v5 — ornament, editorial type, weighted motion

The quote section is gone (component, styles, and the serif font it used all
removed). With nothing below the shape row, the shapes no longer lift away —
they converge and **rest** as the centered "Four ways in" nav, the way they
were meant to.

**Filling the empty black.** Three kinds of decoration, all built from the
existing stipple system in a new static (no-loop) render mode, so a screen full
of them costs almost nothing:

- **Hanging ornament strings** (`OrnamentStrings`) — thin strings dropping from
  the top edge into the hero's wide side margins, each ending in a small stipple
  charm, swaying gently. One charm is picked out in the ember accent.
- **Scattered decorative shapes** (`AmbientField`, rewritten) — a wider set of
  silhouettes than the four nav shapes (rings, crosses, hexes, sparkles, beads,
  generated as new assets under `public/decor/`) drifting in the negative space
  of the hero and around the shape row.
- **A tiled geometric divider** (`GeoDivider`) — a fine diamond-lattice pattern
  bridging the hero and the shape section.

**Editorial typography.** The wordmark and headers move to Inter — an
ultra-refined grotesque in the Neue Haas / Suisse spirit — tracked wide (0.24em)
for an exhibition-catalogue feel. The shirt metadata is now catalogue phrasing
(`CAT. 01 — INTERFERENCE STUDY / EDITION OF 100 / SPECIFICATION`) and that's the
real data shape going forward. Small monospace **corner marks** (`CornerMarks`)
frame the viewport like gallery placard text — a coordinate, material specs, an
edition line.

**Weighted motion.**

- **Lenis** (`SmoothScroll`) adds momentum scrolling site-wide; it smooths native
  scroll, so the scroll-driven shape field stays in sync. Off under
  reduced-motion.
- **Cursor parallax** on the four shapes: each drifts on its own depth in
  response to the pointer (desktop only), strongest while they're scattered,
  calmer once they've lined up — layered on top of the existing idle rotation.

**Performance note.** The decorative canvases render once and stop, so despite
there being many of them, only a handful of animation loops actually run
continuously (grain, the shape field, the ASCII cursor-follow, and Lenis). Colour
stays disciplined: everything is paper/ash on void, with the ember accent used
only as an occasional ornament touch.

---

## v6 — architectural framing (ornament approach reverted)

Last round's decorative ornament — the hanging strings and the extra scattered
stipple shapes — is removed entirely (components, assets, and styles). The four
nav shapes, the grain, the flower, and the corner micro-type are untouched. In
place of "more objects," this round adds quiet structural framing, in the spirit
of a gallery floor plan / archival blueprint:

- **Perimeter frame** (`ViewportFrame`) — a hairline border inset ~22px from the
  viewport edge, with a small **precision crosshair** at each corner. Fixed,
  non-interactive.
- **Coordinate crosshair** — a matching crosshair sits beside the top-right
  coordinate in the corner type.
- **Vertical pillars** — two faint gradient-faded vertical rules flank the hero
  content like exhibition-hall columns.
- **Bracketed accession tags** — the shirt metadata is now
  `[ CATALOGUE NO. 01 ] — [ EDITION: 1/100 ] — [ MEDIUM: ORGANIC COTTON / 380 GSM ]`,
  the real data shape going forward.
- **Dotted leaders** — the coordinate and material-spec corner marks gain a fine
  dotted underline, spec-sheet style.
- **Frieze band** — a thin (~4px) repeating diamond micro-pattern sits just above
  the pagination dots.
- **Arch-cut hero vignette** — the shirt display container gets gently arched top
  corners, a soft radial niche behind the piece, and a hairline border. This is
  the one change to an existing container's shape; `overflow` is intentionally
  left visible so the border and background arch while the arrow and mouse-follow
  ASCII are never clipped. It's the single item to roll back if it clashes with
  the shirt/ASCII.

Everything is CSS/markup and monochrome (hairlines are low-opacity white); no new
rendering and no new colour. The stipple renderer (`ParticleCanvas`) is now unused
but left in place.

---

## v7 — ASCII physics-based interaction

The ASCII shirt's cursor interaction is rebuilt from a whole-block drift into
real per-cell spring physics. The old renderer painted the grid into a single
`<pre>`, where individual characters can't move, so the renderer now draws onto a
**canvas**: each ramp glyph is pre-rendered once into a small atlas and blitted
per cell with `drawImage` (fast enough for the full ~5k-cell grid every frame).

Every cell is a tiny 2D spring driven by plain-number math in a `requestAnimation‑
Frame` loop — no CSS transitions or easing anywhere in the motion:

- Each cell has a rest position (its grid slot), a current offset, and a velocity.
- The cursor applies a radial **repulsion** to cells within a falloff radius, so
  characters bow out of its path.
- Each displaced cell is pulled home by a **spring-damper** (`f = −k·x − c·v`),
  tuned under critical damping (ζ ≈ 0.52) so it overshoots slightly and wobbles
  before settling, rather than snapping or easing flatly.
- Only cells near the cursor (plus any still settling) run the math — a small
  active set — and the loop sleeps entirely once everything is at rest, waking on
  the next pointer move.

It coexists with the existing ASCII-default / "View" toggle: the physics only run
while the ASCII layer is active and the pointer is over it, it's gated to
hover-capable (desktop) pointers, and it doesn't touch the toggle-to-photo
crossfade. Reduced-motion renders the grid statically with no loop. The previous
whole-block mouse-follow is removed (this replaces it).

Not in this round (as specified): the ASCII↔photo dissolve/pixel-sort transition,
and custom cursor states.

---

## v8 — the arrival (the page finally speaks)

The diagnosis this round started from: v2–v7 had accumulated eight decorative
systems — perimeter frame, corner crosshairs, grain, pillars, frieze, pips,
signature stroke, accession tags — arranged around a middle that had nothing in
it. Every *signifier* of a serious gallery object, no object in the room. Three
things were actually draining it, and each has a fix here.

**1. It never spoke.** The entire copy on the homepage was "N.O.A.X", "View", a
catalogue number and "Scroll". A label's soul is mostly voice, and this one
recited its own accession number.

- All hero copy now lives in **`src/data/copy.ts`** — **placeholder, written to
  be overwritten**, same convention as NX-01 "Interference". The words are
  derived from things already true in this repo (the water-based-ink line on
  `/shop`, the editions of 100 in `designs.ts`) rather than an invented brand
  personality. Keep the *shape* — short overline, a two-part statement that
  lands in two breaths, a dry spec line as counterweight — and swap the words.
- The statement is set in **Instrument Serif**, the only serif on the site.
  Everything else is a grotesque or a monospace; after a page of machine type,
  the one line where the label speaks gets the one face with a wrist in it.
  (v4 loaded this face for a quote section, v5 removed both. The face was never
  the problem.)

**2. It hid its only real asset.** The shirt — the one photographed, tactile
thing on the page — defaulted to ASCII, and you had to click "View" to reach the
product. The cleverness was eating the content.

- **The dissolve** (`AsciiRenderer`, the thing v7 deferred). On load the grid
  types on, holds a beat, then melts — and the photograph was underneath it the
  whole time. Cells don't vanish on a wipe: each has its own threshold weighted
  by character density, so the faint ground releases first and the heavy strokes
  that draw the print hold on longest. The image erodes down to its artwork
  before that goes too. Seeded, so it melts identically on every reload.
- The resting state is now **the photograph**. "View" is the way back, and it
  retypes the grid. Forward replays the dissolve; back is immediate — a 1.3s
  ceremony on every button press stops being cinema and becomes a wait.
- Progress is written to a `--dissolve` CSS custom property from the rAF loop,
  never to React state. One number drives the photo's opacity, its settling
  scale, and the bloom, at 60fps with zero re-renders.

**3. The accent was banned.** `ember` existed but was reserved for interactive
states, so the page was grey-on-black with no focal point anywhere.

- **`.shirt-bloom`** — the light the garment arrives into, dim while the page is
  still "reading" the shirt as characters and full once the cloth is really
  there. A warm ember core under a paper halo: the accent as atmosphere.
- The statement's payoff word is ember, and it clears 4.8:1 on the void, so it
  carries real text rather than decoration. New body copy uses a new
  `--paper-dim` token (6.6:1) — `--ash` is only 3.9:1 and is now left to the
  pre-existing micro-type.

**Choreography.** Copy is staged against the shirt's arrival (`--t-*` and the
`.stage-N` classes in `globals.css`, mirroring the intro clock in
`ShirtDisplay`) so the words read as the caption to something that just
happened, not as a page assembling itself. Elements are **visible by default**
and only animate under `prefers-reduced-motion: no-preference` — reduced-motion
visitors get the finished page immediately, never a blank one. Any click, key,
or scroll lands the intro instantly, and a 5.2s ceiling settles it regardless in
case the grid never builds (the sampler waits on image decode *and*
`document.fonts.ready`, so a slow load could otherwise leave the stage empty).

**Layout note.** The statement costs ~14vh the hero wasn't spending, so the
shirt's viewport cap came down (74vh → 62vh, and 54vh under 780px tall). Worth
an eye: on very short viewports the hero can still grow past the fold, and
because `ShapeField` reads `scrollY / vh` directly, a taller hero starts the
shapes converging slightly earlier.

**Still unverified in a browser** — built without one here again. Sanity-check
the dissolve's feel (`DISSOLVE_MS`, `DISSOLVE_FADE`, `DISSOLVE_LIFT` in
`AsciiRenderer`), the bloom's strength, and whether the statement's two beats
land at the right moment against the melt.

---

## v9 — abandoned museum

Time passing in the room v6's framing already built. Two new components, both
pure CSS and markup, both rendered inside `Hero` at z-0 next to the pillars —
so `.hero-content` (z-1) is always in front and the fixed shape overlay (z-40)
always above that. No new rendering, no new colour, nothing interactive.

- **`HeroColumns`** — the carved column, mirrored, flanking the shirt. The
  literal version of the hairline `.pillar` rules, standing outboard of them.
- **`Cobwebs`** — a drape in the top-left corner, a different web in the
  top-right, and one spider on a thread from the top edge. Two drawings rather
  than one mirrored twice: decay that matches on both sides reads as ornament.

**Placement is derived from the artwork, not eyeballed.** `column.png` is a
375×666 canvas with the stone inset ~22% each side, so the *visible* shaft is
1:3.12 and 0.306× the box height wide. Both constants are in the CSS with the
arithmetic spelled out. Sizing runs off `height` with `width: auto` throughout,
which is what guarantees no drawing is ever stretched.

**The columns' width budget is real.** They have to fit between the frame and
the nav shapes, which are anchored at 21.5vw / 81.8vw and drift up to ~41px on
the cursor parallax — so height is capped at `min(48svh, 59vw - 28rem)`. The
second term is what shrinks them as the viewport narrows; by 1280px it stops
yielding anything that reads as architecture, so below that they're dropped
rather than shown as miniatures. Verified against measured rects at 1920, 1440,
1280, 1024 and 390: no column touches a nav shape, the arrow, or the wordmark
at any size, even at worst-case drift.

Both layers measure against `100svh`, not the hero — the hero runs past the
fold on shorter screens (see v8's layout note), and a column anchored to *its*
bottom edge puts its base below the horizon.

**Opacity is the only dial.** Columns 0.17, drape 0.14, right-hand web 0.19,
spider 0.16 — all within the brief's 10–20%. The right-hand web is deliberately
higher than the left: it's much lighter line work, so inverting it yields a
dimmer white and matching numbers would leave that corner looking empty. The
column is the one asset **not** inverted; unlike the flower and the shapes it's
already light-on-transparent, so it only gets `grayscale(1)`.

Each web is feathered by a radial mask anchored at its own corner, so only the
inner edge is taken and the torn silhouette survives. The spider sways ±0.9°
about the thread's anchor on a 38s round trip — roughly 4px of travel, four
times slower than the shapes' idle drift, and declared only under
`prefers-reduced-motion: no-preference`.

Not done, and available if wanted: the optional wide drape across the top edge
of the hero container. Two corner webs already carry it, and the brief asked to
err quiet.

---

## v10 — subtraction, and the arrival made automatic

Mostly reversal. The hero was carrying three things it didn't need, and the
shirt was making you ask for the one thing it exists to show.

- **Columns, gone.** `HeroColumns`, all the `.hero-column*` CSS, and
  `public/decor/column.png` are deleted, not resized. The hairline `.pillar`
  rules v6 added are untouched and go back to being the only colonnade.
- **Flower, gone.** `BrandMark` is now just the wordmark. Typography and
  tracking are exactly as they were; what went with the flower is the stacking
  context and the top padding that only existed to make room for it. The asset
  is still in `public/brand/` but nothing points at it.
- **Spider, moved.** It hangs in the shape section now instead of greeting you
  on load. It lives in `ShapeField` and reads `--assembled` — the same 0..1
  convergence the eyebrow already uses — so it fades and lowers itself in as the
  row forms, and is fully absent at the top of the page. The hero's corner
  drapes are unaffected.
- **Spider idle bob.** On top of the entrance, the artwork runs two continuous
  loops: an 8px vertical bob on a 4.8s round trip (the strand giving and taking
  up again — rest is the top of the travel, so it only ever hangs *below* it),
  and the pre-existing ±0.9° sway on a 38s one. The periods are deliberately
  unrelated so they never line up into something that reads as a cycle.

  **Three motions, two elements.** The wrapper's `transform` is spent on the
  scroll entrance, so the two idle loops share the artwork by animating the
  *individual* transform properties — `translate` for the bob, `rotate` for the
  sway — instead of both fighting over the `transform` shorthand. That's what
  lets them run on different periods without a third wrapper div existing only
  to hold one of them. Setting `transform` on `.shape-spider-art` breaks it.
  Measured in-browser: bob 0→7.94px over its cycle, sway 0.83° across the same
  six seconds, wrapper offset dead constant throughout.

**The shirt reveals itself again.** Every design now plays the dissolve on
arrival: the grid types on, holds ~1s, then melts off the photograph beneath
it. This is the transition that already existed, moved from "on click" to "on
arrival" — the physics, the per-cell thresholds and the reassemble are all
untouched.

- `autoReveal` is the whole state addition. Set on mount and again on every
  design the arrow brings in; cleared the moment you work the toggle yourself.
  So the catalogue reads as a series of arrivals, while a stage you've taken
  manual control of stays where you put it.
- The clock re-arms off `index`, not just the flag — cycling designs leaves
  both `mode` and `autoReveal` already where the effect wants them, and without
  `index` in the deps the second design would sit on its grid forever.
- **Hover doesn't cancel it.** Pushing the characters around is interaction
  with the rendering, not a request to keep it, so the physics and the clock
  run concurrently. v8's window-level "any input skips the intro" listeners are
  gone — they were what made interaction cut the ceremony short.
- `AUTO_REVEAL_MS` is 1000 and the renderer's default type-on is 420ms, so the
  finished grid is complete and readable for roughly half a second. v8 slowed
  the type-on to 900ms for its intro; at a 1s beat that leaves no beat, so the
  slow type-on and its `revealMs` override are gone.
- `--dissolve` is re-zeroed on the way back into ASCII. `settle` parks it at 1
  and the property outlives the transition that wrote it; the next forward
  dissolve sets `dissolving` a frame before the rAF loop writes its first
  progress value, and a stale 1 in that gap flashed the whole photograph. Only
  visible now that the forward transition runs on every design change.
- `REVEAL_CEILING_MS` (5200) survives from v8 and still matters: the ASCII
  layer is transparent until it has a grid, and the photo beneath is held at
  zero while ASCII is active, so a 404'd photo or a `document.fonts.ready` that
  never resolves would otherwise leave the stage blank. It lands the garment
  regardless.

**Follow-up: the niche border is hover-only.** v6's hairline around
`.shirt-stage` no longer shows at rest — the arch and its vignette carry the
framing, and the outline appears on hover. It stays in the box as
`border: 1px solid transparent` and only gets its colour back, because removing
it outright would grow the padding box by 2px, and the ASCII layer is
`inset: 0` against that box with a `ResizeObserver` watching — a bare
`border: none` would re-measure and rebuild the whole grid on every mouse in
and out. The rule is gated on `@media (hover: hover)` so a tap on a touch device
can't leave the outline stuck on.

**One thing left alone deliberately.** The hero copy's `.stage-N` delays were
tuned against v8's clock, where the dissolve began at 1420ms. It now begins at
1000ms, so the turn lands late in the melt rather than midway. Still a beat, so
the numbers are untouched — pull stages 3 and 4 in by ~400ms if you want the
original relationship back. Noted at the top of `globals.css`.
