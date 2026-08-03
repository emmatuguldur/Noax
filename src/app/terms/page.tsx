import type { Metadata } from "next";

import PageShell from "@/components/PageShell";

/**
 * ============================================================================
 * TODO(noax): PLACEHOLDER — NOT LEGAL TEXT. DO NOT LAUNCH WITH THIS PAGE AS IS.
 * ============================================================================
 *
 * This route exists so the footer's "Terms of Service" link resolves instead of
 * 404ing. Nothing below is enforceable and none of it has been reviewed by a
 * lawyer.
 *
 * Before the shop takes a single real order, this has to be replaced with terms
 * that actually cover: what you are selling, order and payment, shipping and
 * customs out of Mongolia, returns and the statutory cancellation rights of
 * wherever you ship to, limitation of liability, and governing law.
 *
 * The same applies to `/privacy`.
 *
 * `noindex` is set below on purpose — placeholder legal text should not be
 * indexed and then cited back at you. Remove it with the placeholder.
 */

export const metadata: Metadata = {
  title: "Terms of Service — N.O.A.X",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <PageShell eyebrow="Legal" title="Terms of Service">
      <p className="page-placeholder">
        Placeholder — this page is not the real terms and has no legal effect.
        Proper text is required before launch.
      </p>
      <p>Content coming soon.</p>
    </PageShell>
  );
}
