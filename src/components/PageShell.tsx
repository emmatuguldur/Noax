import Link from "next/link";

import { NAV_ITEMS } from "@/data/navItems";

interface PageShellProps {
  eyebrow: string;
  title: string;
  /**
   * The prose column. Optional: the product page carries its copy inside the
   * two-column layout it passes as `bleed`, so a 36rem measure above that would
   * only be an empty gap.
   */
  children?: React.ReactNode;
  /**
   * Optional full-bleed region, rendered after the prose column and allowed to
   * escape its 36rem measure. It hangs off `.page-main` rather than
   * `.page-body` because only `.page-main` is centred in the viewport — the
   * `50% - 50vw` breakout is wrong from anywhere else.
   */
  bleed?: React.ReactNode;
}

/**
 * Minimal shared frame for the four routes. The homepage has no persistent
 * navbar by design; the sub-pages get a light one so you are never stranded —
 * the wordmark returns home and the other three pages are one hop away.
 */
export default function PageShell({ eyebrow, title, children, bleed }: PageShellProps) {
  return (
    <div className="page">
      <header className="page-head">
        <Link href="/" className="page-word" aria-label="N.O.U.X — home">
          N.O.U.X
        </Link>
        <nav className="page-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.id} href={item.href} className="page-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="page-main">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {/* Skipped entirely when empty — `.page-body` carries a top margin that
            would otherwise open a gap under the title for nothing. */}
        {children ? <div className="page-body">{children}</div> : null}
        {bleed ? <div className="page-bleed">{bleed}</div> : null}
      </main>

      <footer className="page-foot">
        <span>N.O.U.X <span aria-hidden="true">/</span> Ulaanbaatar</span>
        <Link href="/" className="page-foot-link">
          Back home
        </Link>
      </footer>
    </div>
  );
}
