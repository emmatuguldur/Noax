import type { Metadata } from "next";

import PageShell from "@/components/PageShell";

/**
 * ============================================================================
 * TODO(noax): PLACEHOLDER — NOT LEGAL TEXT. DO NOT LAUNCH WITH THIS PAGE AS IS.
 * ============================================================================
 *
 * This route exists so the footer's "Privacy Policy" link resolves instead of
 * 404ing. Nothing below is a policy and none of it has been reviewed by a
 * lawyer.
 *
 * A privacy policy is the one page here with a hard legal deadline: the moment
 * the site collects anything — an order, an email, analytics, a payment
 * processor's cookies — a real one is required, and under GDPR it has to name
 * what you collect, why, on what lawful basis, who you share it with, how long
 * you keep it, and how someone asks for it back or deleted.
 *
 * Write it against what the site actually does at that point, not against this
 * template. The same applies to `/terms`.
 *
 * `noindex` is set below on purpose — a placeholder policy should not be
 * indexed and then relied on. Remove it with the placeholder.
 */

export const metadata: Metadata = {
  title: "Privacy Policy — N.O.A.X",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <PageShell eyebrow="Legal" title="Privacy Policy">
      <p className="page-placeholder">
        Placeholder — this page is not the real policy and has no legal effect.
        Proper text is required before launch.
      </p>
      <p>Content coming soon.</p>
    </PageShell>
  );
}
