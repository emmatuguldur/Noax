import Link from "next/link";

import { FOOTER_COPY, type FooterItem } from "@/data/copy";

/**
 * One footer entry. How it renders is decided by its `href`: an internal route
 * gets `next/link` so it prefetches like the rest of the site, an external URL
 * opens in a new tab, `mailto:` gets a plain anchor, and an item with no `href`
 * stays text instead of pretending to be a link.
 */
function FooterEntry({ item }: { item: FooterItem }) {
  if (!item.href) {
    return <span className="foot-link">{item.label}</span>;
  }

  if (item.href.startsWith("/")) {
    return (
      <Link className="foot-link foot-link-live" href={item.href}>
        {item.label}
      </Link>
    );
  }

  /* Same treatment the Instagram link on `/contact` already uses. */
  if (item.href.startsWith("http")) {
    return (
      <a
        className="foot-link foot-link-live"
        href={item.href}
        rel="noreferrer noopener"
        target="_blank"
      >
        {item.label}
      </a>
    );
  }

  return (
    <a className="foot-link foot-link-live" href={item.href}>
      {item.label}
    </a>
  );
}

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
 * Every item comes from `FOOTER_COPY.columns`; `FooterEntry` above decides how
 * each one renders from its `href`.
 */
export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="site-foot-main">
        <div className="site-foot-brand">
          <p className="site-foot-word">N.O.A.X</p>
          <p className="site-foot-blurb">{FOOTER_COPY.blurb}</p>

          {/* Key, leader, value — the dotted rule is decoration between two
              pieces of text that already read as a pair, so it is hidden from
              assistive tech rather than announced as an empty element. */}
          <p className="site-foot-origin">
            <span>{FOOTER_COPY.origin.key}</span>
            <span className="site-foot-leader" aria-hidden="true" />
            <span className="site-foot-origin-value">{FOOTER_COPY.origin.value}</span>
          </p>
        </div>

        <div className="site-foot-cols">
          {FOOTER_COPY.columns.map((column) => (
            <div className="site-foot-col" key={column.tag}>
              <p className="site-foot-tag">{column.tag}</p>
              <ul className="site-foot-list">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <FooterEntry item={item} />
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
