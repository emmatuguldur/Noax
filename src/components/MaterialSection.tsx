import { MATERIAL_COPY } from "@/data/copy";

/**
 * The material section — an asymmetric editorial spread: copy and two hard
 * numbers on the left, two offset macro plates of the cloth on the right.
 *
 * v12 closed this with an oversized pull-quote over a ghost word; v13 removed
 * the quote, and the ghost and the glow dot went with it — they existed to sit
 * behind that statement, and a giant faint word with nothing in front of it is
 * a decorative band, not a section. What's left is the evidence, which was
 * always the part carrying the argument.
 *
 * The first figure is a real macro photograph; the second is still a
 * procedurally generated stand-in at `public/fabric/texture-placeholder-2.png`,
 * named to be found and replaced. The `object-fit: cover` frames mean real
 * photography drops in at any aspect ratio without touching the layout.
 */
export default function MaterialSection() {
  return (
    <section className="material" aria-labelledby="material-title">
      <div className="material-top">
        <div className="material-copy">
          <p className="material-eyebrow">{MATERIAL_COPY.eyebrow}</p>
          <h2 className="material-title" id="material-title">
            {MATERIAL_COPY.title}
          </h2>
          <p className="material-body">{MATERIAL_COPY.body}</p>

          <dl className="material-stats">
            {MATERIAL_COPY.stats.map((stat) => (
              <div className="material-stat" key={stat.label}>
                <dt className="material-stat-value">
                  {stat.value}
                  {/* The section's only warm mark, and it's one glyph wide. */}
                  {stat.unit ? <span className="material-stat-unit">{stat.unit}</span> : null}
                </dt>
                <dd className="material-stat-label">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Offset rather than aligned: the second plate hangs lower and further
            out, so the pair reads as laid down by hand. */}
        <div className="material-figures">
          {MATERIAL_COPY.figures.map((figure, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={figure.src}
              src={figure.src}
              alt={figure.alt}
              className={`material-figure material-figure-${i + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
