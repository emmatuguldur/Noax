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
- `public/shirts/design-1.png` is the real shirt (transparent cutout), joined in
  v14 by `design-1-back.png` and `design-1-model.png` — the three views the
  product gallery shows. **Designs 2 and 3 now have all three views too.**
  `design-4.png` and `design-5.png` are still the **same image as stand-ins**
  with no back or model shot; drop real cutouts in and update
  `src/data/designs.ts`. The gallery renders whatever views exist, so adding
  `back` / `model` to a slot is all that's needed to give it a full set — and
  a slot whose files are on disk but *not* named in `designs.ts` shows a single
  frame with no thumbnails or arrows, which is exactly what 2 and 3 did.
- **Photo scale.** The shirt photos are cropped inconsistently — the garment
  covered anywhere from 64% to 100% of the frame — so the product gallery
  applies a measured per-photo zoom from `src/data/photoScale.ts` on top of
  `object-fit: contain`. Design 1 is the reference. **If you re-crop or replace
  a photo, re-measure its entry** (or delete it, which falls back to 1) or it
  will render at the wrong size. The right long-term fix is consistent crops at
  the source, which would let that file shrink to nothing.
- **Colourways.** Designs 2 and 3 are each cut in two colours, held in
  `Design.colorways` (first entry = default = what the hero and shop grid show).
  Design 2 defaults to white with a black alternate; design 3 is the reverse.
  The alternate's shots are the `-switch` files.
  **Two are still missing: `design-3-switch.png` and `design-3-switch-back.png`.**
  Both are already named in `src/data/designs.ts`, so dropping the files into
  `public/shirts/` is the whole fix — until then, design 3's white swatch shows
  a broken front frame and back thumbnail.
- In `src/data/designs.ts`, **NX-01 "Interference"** is a name/blurb I wrote —
  overwrite it. NX-02..05 read "Forthcoming" until their photos land.
- Shape art lives in `public/shapes/` (star = About, diamond = Shop,
  sphere = Story, triangle = Contact).
- `public/fabric/texture-placeholder-1.png` is a **real macro photograph** as of
  v13. `-2.png` (label and stitching) is still a **procedurally generated
  stand-in** — drop a real macro shot in at the same path. Any aspect ratio
  works; the frames are `object-fit: cover`.
- `public/brand/flower.png` is **no longer used** — v10 took the watermark out
  from behind the wordmark. The file is left on disk in case it comes back;
  nothing references it.
- `src/data/legal.ts` holds the facts `/terms` and `/privacy` share. Every
  `null` in it — registered entity, addresses, delivery windows, hosting
  region, phone — renders as a **loud ember blank in the live page** rather
  than being guessed. Both routes are `noindex` until they're all filled; that
  line comes off with the last blank. The text itself covers **Mongolian law
  and domestic delivery only** — no international shipping, customs, or
  EU/UK consumer rights.
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

---

## v12 — material section, footer, and the hero goes quiet again

Two new sections after the shape row, and one removal in the hero.

**The hero statement is gone.** "The ink doesn't sit on the cloth. / It sinks
in." was appearing directly under the garment *and* as the pull-quote in the
new section — the same sentence twice on one page. It now lives only in the
material section, where it has fabric to be about. The hero keeps the spec
line; `.hero-statement`, `.hero-turn`, `.stage-3/-4` and the `stageInSoft`
keyframes went with it, and the shirt's `max-height: 780px` compensation no
longer has a statement to make room for. Verified: the phrase appears exactly
once in the rendered page.

**`MaterialSection`** — the answer to v4's standalone quote that v5 removed for
being a sentence floating in a void. Same words, different argument: heading,
process copy, two hard numbers and two macro plates come first, so by the time
the statement arrives the claim has already been evidenced. Asymmetric top
band (copy left, offset figures right), then the statement centred over an
oversized ghost word with a soft glow dot off to one side.

**`SiteFooter`** — wordmark and blurb left, two labelled columns right, thin
divider, bottom bar. Sub-pages keep their own `.page-foot`; this closes the
long scroll, which they don't have.

**The shape row now has to leave.** This is the part the brief didn't call for
and the page needed: `.shape-field` is a *fixed* overlay that used to be the
last thing on the page, so it could assemble at mid-viewport and simply stay.
With two sections scrolling up underneath it, four shapes parked over the
footer would have been the result. It now fades out over `EXIT_START`→`EXIT_END`
(1.15→1.5 scrolled viewports) and goes `inert` at 60% — a faded link that still
catches clicks meant for the footer, or still takes focus, is the real bug.
`.shape-spacer` grew 85vh → 150vh to give the row a proper hold and an exit
before the material section arrives. Measured at 1440x900 and 390x844: the
field is at opacity 0 and inert before the material section's top edge enters
the viewport.

**Footer links are secondary and inert by design.** Catalog / Archives /
Information / Journal are *not* the four-shape navigation and don't rename or
replace it — the shapes remain the way in. Those sections have no routes yet,
so they render as `<span>`, not as anchors that would 404 or swallow a click.
The only live link is the `mailto:`. Add `next/link` and the `.foot-link-live`
class when the pages exist.

**Two things worth knowing.**
- The fabric images are procedurally generated placeholders (see Assets above),
  not stock photography — deliberately obvious stand-ins at findable paths.
- `.material-quote` carries the serif face and size itself rather than putting
  them on the two spans, because `max-width` in `ch` resolves against the
  element's *own* font — set on the container at its inherited 1rem it came out
  about a third of the intended measure and shattered the line into four.

---

## v13 — the shape row is pinned, not fixed forever

**Root cause fixed.** `.shape-field` was `position: fixed` indefinitely, so it
stayed glued to the viewport over everything below it; v12 papered over that
with an opacity fade plus `inert`. Both are gone. The field is now
`position: sticky` inside `.shape-track`: it holds at the top of the viewport
for the length of the track, then releases and scrolls away like any section.

The guarantee is structural rather than timed — a sticky element's box cannot
extend past its containing block, and the track ends exactly where
`MaterialSection` begins, so overlap is impossible by construction. Measured
across a full scroll sweep at 1440x900 and 390x844: **worst overlap 0px**, and
a hit test at the centre of the material section and the footer returns those
sections' own elements, never anything inside `.shape-field`. Through the
handoff the field tracks scroll 1:1 with its bottom edge exactly on the
material section's top — no jump, no gap.

**Why not ScrollTrigger, which the brief asked for.** Two blockers, both
concrete:

1. *The scatter phase happens over the hero.* The shapes are live at scroll 0,
   positioned at viewport-fraction anchors around the shirt. ScrollTrigger's
   pin fixes an element wherever it sits when the pin starts, so pinning a
   section placed after the hero would mean the shapes simply aren't there
   during the hero — which breaks "assemble and hold exactly as before", an
   explicit verification item in the same brief. Pinning from the document top
   instead needs `pinSpacing: false` on an out-of-flow overlay, and then the
   unpin returns it to the top of the document rather than parking it at the
   end of its range.
2. *Lenis.* ScrollTrigger needs explicit wiring to Lenis (`ScrollTrigger.update`
   on Lenis's scroll event) or pinned elements jitter. That integration isn't
   in `SmoothScroll` today. Native sticky needs none of it, because Lenis in
   default mode scrolls the real document.

Sticky delivers the brief's actual requirement — pinned for the assemble and
hold, released afterwards, no manual fade or `inert` — with less machinery. If
ScrollTrigger is wanted regardless, the Lenis wiring has to land first.

**The one cost** is a wrapper. Sticky needs the field in normal flow and as the
track's *first* child to hold from the first frame, so `.shape-under` is pulled
up by `-100svh` to put the hero back at the top of the page. The negative margin
goes on the wrapper, never on the field: a negative bottom margin *extends* the
rectangle a sticky element may stick within, which would destroy the very
containment keeping it off the footer. `.shape-field-eyebrow` and
`.shape-spider` moved from `fixed` to `absolute` for the same reason — as fixed
they'd have stayed glued to the viewport after the release.

**Also this round.**
- **Real fabric photo** at `public/fabric/texture-placeholder-1.png` (1024x1024
  twill macro). The second plate stays procedural. No layout changes needed.
- **Pull-quote removed entirely.** The ghost word and the glow dot went with it
  — they existed to sit behind that statement, and a giant faint word with
  nothing in front of it is a decorative band, not a section. `.material` gained
  bottom padding, which the quote block had been providing.
- **Footer links are real routes.** About / Contact / Shop / Story via
  `next/link`, replacing the inert Catalog / Archives / Information / Journal
  spans. This duplicates the four-shape destinations in text form and is the
  only way to reach those pages without driving a scroll-scrubbed animation;
  the shape field itself is untouched. `FOOTER_COPY` is now annotated rather
  than `as const`, because one item deliberately has no `href` and `as const`
  widens that to a union where `href` isn't readable at all.

---

## v14 — clickable prints and a product page

First real commerce content beyond the homepage.

**The shop cards are links now, and nothing else about them changed.** The only
edit to `ShopChaos` is a `next/link` wrapper around `.riot-plate`. That wrapper
is not incidental: it lands between `.riot-slot`, which owns the `perspective`,
and `.riot-plate`, which owns the `preserve-3d` and the tilt — so without
`transform-style: preserve-3d` of its own it flattens the entire card, killing
the tilt, the echo's Z offset and the floating tags in one go.

Verified rather than assumed. Measured against the full 3D maths (perspective
x rotation x scale) all five cards match prediction to **0.01px**, and forcing
the wrapper to `transform-style: flat` visibly shrinks every card — e.g. CAT. 04
from 521.7px wide to 462.9px. The `preserve-3d` is load-bearing.

*(A first pass at that check reported all five cards "flat". That was the test
being wrong, not the page: the formula ignored `.riot-slot`'s 4–9° rotation,
which inflates the axis-aligned bounding box. The measured values were *larger*
than predicted, not equal to `--scale`, which is the opposite of what flattening
looks like.)*

**`/shop/[slug]`** — one page per catalogue slot, slug is the design's `id`.
`generateStaticParams` prerenders all five; an unknown slug 404s rather than
rendering an empty template. Chrome comes from `PageShell`, so the header, nav
and footer match the other routes; the two-column layout goes in `bleed`
because it is wider than the shell's 36rem prose measure. `PageShell`'s
`children` became optional — this page carries its copy inside the bleed, and
an empty `.page-body` would only open a gap under the title.

- **Gallery** — one large frame plus a thumbnail row. Frames are square with
  `object-fit: contain` because the three views don't share a ratio: the cutouts
  are 1.19:1 and the model shot is 0.75:1. A square is the one frame that holds
  both without cropping the garment or stranding it in empty void, and real
  photography can drop in later at any ratio.
- **Graceful degradation** — `back` and `model` are optional on `Design`. Only
  CAT. 01 has them, so the other four render a single frame and no thumbnail
  row rather than a broken tab strip.
- **Specification** — Material / Fit / Edition as dotted-leader spec rows, the
  same micro-type convention as the corner marks. The cart button is
  `.view-toggle` at product scale, so the one button here is visibly the same
  species as the one in the hero.

**The cart button is honest about being inert.** There is no cart system, so it
carries `aria-disabled="true"` and a line underneath pointing at `hi@noax.mn`,
rather than looking live and swallowing the click. Wire it up and delete the
note.

**New assets** — `public/shirts/design-1-back.png` (1120x944) and
`design-1-model.png` (896x1195), dropped in as provided. Both carry a small
generator watermark in the corner; worth a clean re-export before launch.

---

## v15 — product page fixes

- **Origin row.** `Design` gains `origin`; the whole run is `Mongolia`, kept
  per-design rather than hardcoded in the page. Appended after Edition so no
  existing row moves.
- **Uniform thumbnails.** The boxes were already the same square — what looked
  ragged was `object-fit: contain` letterboxing the 0.75:1 model shot into a
  tall sliver between two nearly-full 1.19:1 cutouts. Now `cover` on all three.
  Measured: 184.9 x 184.9 each, spread 0.02px. The trade is that the cutouts
  lose ~8% a side, clipping the sleeve tips in the thumbnail — the main frame
  still uses `contain`, so the whole garment is always visible there.
- **Arrow navigation.** Prev/next circles inside the main frame, wrapping both
  ways: Front → Back → Worn → Front, and backwards from Front to Worn. The
  hero's `.arrow-next` treatment, with one deviation — these sit on the
  photographs rather than the void, including the model shot's white studio
  wall, so they carry a scrim. The `[ WORN ]` caption got the same scrim for
  the same reason; on white, `--ash` was barely there.
- **Size selector** between description and cart. S/M/L/XL/XXL as real radios
  in a `fieldset`, visually hidden and drawn as boxes — a row of `<button>`s
  would have looked identical and been wrong, since radios give single
  selection, arrow-key movement and the right screen-reader announcement for
  free. Selected is `--ember`, the same signal `.pip-on` and
  `.product-thumb-on` already use. Verified: exactly one selection at a time,
  `rgb(201, 96, 26)` on the chosen box.
- **The note now reports the nearest blocker** — "Choose a size to continue."
  until one is picked, then the checkout-isn't-live line. The button stays
  `aria-disabled` throughout, because there is still no cart behind it.

Stock is not modelled; every size is offered. When inventory exists, the
unavailable ones want `disabled` on the input, not a missing box.

**Follow-up: the main frame wasn't actually square.** Asked to make the model
shot smaller, the cause turned out to be a layout bug rather than a size
choice. `.product-frame` is a flex item in a column and `.product-frame img` is
a grid item, so both take an *automatic minimum size* from their content — and
for the 0.75:1 model shot that is taller than the square they were told to be.
`aspect-ratio: 1 / 1` lost to it at both levels: the frame rendered 587x782
against the cutouts' 587x587, and shoved the thumbnail row 195px down the page
whenever that view was selected.

`min-height: 0` on both restores the square and lets `object-fit: contain` do
its job. Measured after: all three views 587x587, thumbnails fixed at the same
offset, and the model shot drawn at 438x585 instead of 585x780 — smaller, whole,
and consistent with the other two. Note the frame needed the fix *and* the image
did; fixing only the frame left the image at 585x780 with `overflow: hidden`
quietly cropping the model's head and feet. The thumbnails were never affected,
because an explicit `aspect-ratio` replaces the natural ratio in that
calculation.
