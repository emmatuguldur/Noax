import Link from "next/link";

import { FOOTER_COPY } from "@/data/copy";

/**
 * The homepage footer. Sub-pages keep their own `.page-foot` — this closes the
 * long scroll, which they don't have.
 *
 * The navigation column repeats the four shape destinations as ordinary text
 * links. That is on purpose: it duplicates the shape field rather than
 * replacing it, and it is the only way to reach those pages that doesn't
 * require driving a scroll-scrubbed animation — which matters for keyboard and
 * screen-reader users, and for anyone who has already scrolled past the row.
 *
 * How an item renders is decided by its `href`: an internal route gets
 * `next/link` so it prefetches like the rest of the site, `mailto:` gets a
 * plain anchor, and an item with no `href` stays text instead of pretending to
 * be a link.
 */
export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="site-foot-main">
        <div className="site-foot-brand">
          <p className="site-foot-word">N.O.A.X</p>
          <p className="site-foot-blurb">{FOOTER_COPY.blurb}</p>
        </div>

        <div className="site-foot-cols">
          {FOOTER_COPY.columns.map((column) => (
            <div className="site-foot-col" key={column.tag}>
              <p className="site-foot-tag">{column.tag}</p>
              <ul className="site-foot-list">
                {column.items.map((item) => (
                  <li key={item.label}>
                    {!item.href ? (
                      <span className="foot-link">{item.label}</span>
                    ) : item.href.startsWith("/") ? (
                      <Link className="foot-link foot-link-live" href={item.href}>
                        {item.label}
                      </Link>
                    ) : (
                      <a className="foot-link foot-link-live" href={item.href}>
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="site-foot-bar">
        <span>{FOOTER_COPY.legal}</span>
        <span>{FOOTER_COPY.mark}</span>
      </div>
    </footer>
  );
}
