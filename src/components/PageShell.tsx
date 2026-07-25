import Link from "next/link";

import { NAV_ITEMS } from "@/data/navItems";

interface PageShellProps {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

/**
 * Minimal shared frame for the four routes. The homepage has no persistent
 * navbar by design; the sub-pages get a light one so you are never stranded —
 * the wordmark returns home and the other three pages are one hop away.
 */
export default function PageShell({ eyebrow, title, children }: PageShellProps) {
  return (
    <div className="page">
      <header className="page-head">
        <Link href="/" className="page-word" aria-label="N.O.A.X — home">
          N.O.A.X
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
        <div className="page-body">{children}</div>
      </main>

      <footer className="page-foot">
        <span>N.O.A.X <span aria-hidden="true">/</span> Ulaanbaatar</span>
        <Link href="/" className="page-foot-link">
          Back home
        </Link>
      </footer>
    </div>
  );
}
