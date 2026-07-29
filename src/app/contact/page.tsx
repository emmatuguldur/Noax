import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Contact — N.O.A.X" };

export default function ContactPage() {
  return (
    <PageShell eyebrow="Contact" title="Come by, or write.">
      <div className="contact-links">
        <a className="contact-link" href="mailto:noaxthebest@gmail.com">
          noaxthebest@gmail.com
        </a>
        <a className="contact-link" href="mailto:hi@noax.mn">
          hi@noax.mn
        </a>
        <a
          className="contact-link"
          href="https://instagram.com/noax"
          rel="noreferrer noopener"
          target="_blank"
        >
          instagram / noax
        </a>
      </div>
      <p>
        Studio in Ulaanbaatar, open by appointment. Stockist and wholesale enquiries are
        welcome at the same address.
      </p>
      <ContactForm />
    </PageShell>
  );
}
