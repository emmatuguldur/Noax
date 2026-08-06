import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import CuttingBackground from "@/components/CuttingBackground";
import PageShell from "@/components/PageShell";
import { LEGAL } from "@/data/legal";

export const metadata: Metadata = { title: "Contact — N.O.U.X" };

/**
 * Contact details come from `LEGAL` rather than being written out here. This
 * page used to advertise its own pair — `hi@noax.mn` and `instagram.com/noax` —
 * while the footer and both legal pages advertised a different one, so one of
 * the two was always wrong. Reading the shared constant is what stops that
 * happening again the next time something is renamed.
 */
export default function ContactPage() {
  return (
    <>
      <CuttingBackground />
      <PageShell eyebrow="Contact" title="Come by, or write.">
        <div className="contact-links">
          <a className="contact-link" href={`mailto:${LEGAL.email}`}>
            {LEGAL.email}
          </a>
          <a
            className="contact-link"
            href={LEGAL.instagramUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            instagram / {LEGAL.instagramHandle.slice(1)}
          </a>
        </div>
        <p>
          Studio in Ulaanbaatar, open by appointment. Stockist and wholesale enquiries are
          welcome at the same address.
        </p>
        <ContactForm />
      </PageShell>
    </>
  );
}
