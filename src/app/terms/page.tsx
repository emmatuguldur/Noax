import type { Metadata } from "next";

import LegalBlank from "@/components/LegalBlank";
import PageShell from "@/components/PageShell";
import { LEGAL } from "@/data/legal";

/**
 * The real terms, replacing the placeholder that had been holding this route
 * open. The text is the client's, written against the Civil Code of Mongolia
 * and the Law on Consumer Protection; the clause numbers are theirs too and are
 * transcribed rather than generated, so nothing here renumbers itself.
 *
 * Two things are still open, and neither is mine to close:
 *
 *  - The facts marked with `LegalBlank` — the registered entity, the address,
 *    the delivery windows. They live in `src/data/legal.ts` and render as loud
 *    ember gaps until they are filled.
 *  - Scope. This document covers domestic delivery within Mongolia only. There
 *    is no international shipping, customs, or EU/UK consumer-rights language
 *    in it, and the shop is in English and takes cards. If it sells abroad, a
 *    lawyer has to close that gap.
 *
 * `noindex` stays until the blanks are filled — a public terms page with
 * "[registered legal entity name]" in it is worse than no page. Remove it in
 * the same commit as the last blank, here and on `/privacy`.
 */

export const metadata: Metadata = {
  title: "Terms of Service — N.O.A.X",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <PageShell eyebrow="Legal" title="Terms of Service">
      <p className="legal-updated">Last updated — {LEGAL.lastUpdated}</p>

      <p>
        Welcome to <span className="legal-term">N.O.A.X</span> (the &ldquo;Site&rdquo;).
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of our
        website, including the purchase of our limited-edition clothing and accessories
        (the &ldquo;Products&rdquo;). N.O.A.X is a clothing brand designed in Mongolia and
        operated by <LegalBlank value={LEGAL.entity} label="registered legal entity name" />{" "}
        (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
      </p>

      <p>
        By accessing the Site, placing an order, or engaging with our services, you agree
        to be bound by these Terms, which constitute a legally binding agreement. These
        Terms are drafted in accordance with the{" "}
        <span className="legal-term">Civil Code of Mongolia</span>, the{" "}
        <span className="legal-term">Law on Consumer Protection</span>, and other
        applicable regulations of Mongolia.
      </p>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">01</span>
          Definitions and interpretation
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">1.1</span>
            <span className="legal-term">&ldquo;Customer&rdquo;</span> or{" "}
            <span className="legal-term">&ldquo;User&rdquo;</span> refers to any individual
            who accesses the Site or purchases Products.
          </li>
          <li className="legal-clause">
            <span className="legal-num">1.2</span>
            <span className="legal-term">&ldquo;Merchant&rdquo;</span> refers to{" "}
            <LegalBlank value={LEGAL.entity} label="registered legal entity name" />,
            registered in Mongolia.
          </li>
          <li className="legal-clause">
            <span className="legal-num">1.3</span>
            <span className="legal-term">&ldquo;Products&rdquo;</span> refers to the apparel
            and goods listed for sale, including limited-edition items (e.g.,
            &ldquo;Edition 1/100&rdquo;).
          </li>
          <li className="legal-clause">
            <span className="legal-num">1.4</span>
            <span className="legal-term">&ldquo;Order&rdquo;</span> refers to the request
            made by a Customer to purchase Products through the Site.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">02</span>
          Eligibility
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">2.1</span>
            You must be at least 18 years old, or the age of legal majority in your
            jurisdiction, to place an order on this Site.
          </li>
          <li className="legal-clause">
            <span className="legal-num">2.2</span>
            By placing an order, you represent that you meet this requirement and have the
            legal capacity to enter into a binding contract under Mongolian law.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">03</span>
          Products, editions, and availability
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">3.1</span>
            <span className="legal-term">Limited editions.</span> Many N.O.A.X products are
            released in limited quantities. We do not guarantee that any product will
            remain in stock or be restocked once sold out.
          </li>
          <li className="legal-clause">
            <span className="legal-num">3.2</span>
            <span className="legal-term">Accuracy.</span> We make every effort to display
            product colours, materials, and details accurately. However, slight variations
            may occur due to production processes, screen display differences, or the
            nature of small-batch printing. Such minor discrepancies do not constitute a
            defect.
          </li>
          <li className="legal-clause">
            <span className="legal-num">3.3</span>
            <span className="legal-term">Quantity limits.</span> We reserve the right to
            limit the quantity of any product a customer may purchase to ensure fair access
            to limited-edition items.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">04</span>
          Pricing, currency, and taxation
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">4.1</span>
            <span className="legal-term">Currency.</span> All prices are listed in{" "}
            <span className="legal-term">Mongolian Tugrik (MNT)</span>.
          </li>
          <li className="legal-clause">
            <span className="legal-num">4.2</span>
            <span className="legal-term">VAT.</span> In accordance with Mongolian tax laws,
            all prices are inclusive of{" "}
            <span className="legal-term">Value Added Tax (VAT)</span> at the rate of 10%
            unless otherwise stated.
          </li>
          <li className="legal-clause">
            <span className="legal-num">4.3</span>
            <span className="legal-term">Price changes.</span> We reserve the right to
            change prices at any time. The price charged for an order will be the price
            displayed at the time the order is placed.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">05</span>
          Ordering and payment
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">5.1</span>
            <span className="legal-term">Order acceptance.</span> Placing an order
            constitutes an offer to purchase. A binding contract is formed only when we
            confirm your order and dispatch the Products. We reserve the right to decline
            any order for reasons including stock unavailability or pricing errors.
          </li>
          <li className="legal-clause">
            <span className="legal-num">5.2</span>
            <span className="legal-term">Payment methods.</span> We accept local payment
            methods including{" "}
            <span className="legal-term">QPay, SocialPay, and local bank transfers</span>,
            as well as international cards (Visa/Mastercard) where applicable.
          </li>
          <li className="legal-clause">
            <span className="legal-num">5.3</span>
            <span className="legal-term">Security.</span> Payments are handled by secure
            third-party processors. We do not store your full payment card details on our
            servers.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">06</span>
          Shipping and delivery
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">6.1</span>
            <span className="legal-term">Coverage.</span> We deliver within{" "}
            <span className="legal-term">Ulaanbaatar.</span>
          </li>
          <li className="legal-clause">
            <span className="legal-num">6.2</span>
            <span className="legal-term">Timelines.</span>
            <ul className="legal-list" role="list">
              <li>
                <span className="legal-term">Ulaanbaatar:</span> standard delivery within{" "}
                <LegalBlank
                  value={LEGAL.deliveryUlaanbaatar}
                  label="2,3"
                />{" "}
                days.
              </li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">07</span>
          Returns, exchanges, and refunds
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">7.1</span>
            <span className="legal-term">14-day exchange right.</span> In compliance with
            the{" "}
            <span className="legal-term">
              Law on Consumer Protection of Mongolia
            </span>
            , you may exchange a non-food product within{" "}
            <span className="legal-term">14 days</span> of receipt if it does not fit or
            the style is not as expected.
          </li>
          <li className="legal-clause">
            <span className="legal-num">7.2</span>
            <span className="legal-term">Conditions.</span> Items must be unworn, unwashed,
            in original condition, with all tags attached, and accompanied by proof of
            purchase.
          </li>
          <li className="legal-clause">
            <span className="legal-num">7.3</span>
            <span className="legal-term">Exemptions.</span> For hygiene reasons, returns
            are not accepted for{" "}
            <span className="legal-term">innerwear, swimwear, or earrings</span>.
            Limited-edition items marked as &ldquo;Final Sale&rdquo; are ineligible for
            return unless defective.
          </li>
          <li className="legal-clause">
            <span className="legal-num">7.4</span>
            <span className="legal-term">Defective goods.</span> If a product is defective,
            you are entitled to a repair, replacement, or refund as per{" "}
            <span className="legal-term">Article 254 of the Civil Code of Mongolia</span>.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">08</span>
          Intellectual property
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">8.1</span>
            All content on this Site, including clothing designs, graphics, logos,
            photography, and the <span className="legal-term">N.O.A.X</span> brand mark, is
            the exclusive property of N.O.A.X.
          </li>
          <li className="legal-clause">
            <span className="legal-num">8.2</span>
            Reproduction, modification, or distribution of any content without prior
            written consent is strictly prohibited under the{" "}
            <span className="legal-term">
              Law on Copyright and Related Rights of Mongolia
            </span>
            .
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">09</span>
          Limitation of liability
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">9.1</span>
            To the fullest extent permitted by Mongolian law, N.O.A.X shall not be liable
            for any indirect or consequential damages arising from the use of the Site or
            Products.
          </li>
          <li className="legal-clause">
            <span className="legal-num">9.2</span>
            We are not liable for allergic reactions to fabrics or minor colour
            discrepancies due to screen settings.
          </li>
          <li className="legal-clause">
            <span className="legal-num">9.3</span>
            Our total liability for any claim shall not exceed the amount paid for the
            product in question.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">10</span>
          Governing law and dispute resolution
        </h2>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">10.1</span>
            <span className="legal-term">Governing law.</span> These Terms are governed by
            the <span className="legal-term">laws of Mongolia</span>.
          </li>
          <li className="legal-clause">
            <span className="legal-num">10.2</span>
            <span className="legal-term">Dispute resolution.</span> Any disputes shall
            first be attempted to be resolved through amicable negotiation.
          </li>
          <li className="legal-clause">
            <span className="legal-num">10.3</span>
            <span className="legal-term">Jurisdiction.</span> Unresolved disputes shall be
            submitted to the exclusive jurisdiction of the{" "}
            <span className="legal-term">
              competent courts in Ulaanbaatar, Mongolia
            </span>
            .
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">11</span>
          Contact us
        </h2>
        <p>For any questions regarding these Terms, please contact us at:</p>
        <ul className="legal-list" role="list">
          <li>
            <span className="legal-term">Email:</span>{" "}
            <a className="legal-link" href={`mailto:${LEGAL.email}`}>
              {LEGAL.email}
            </a>
          </li>
          <li>
            <span className="legal-term">Instagram:</span>{" "}
            <a
              className="legal-link"
              href={LEGAL.instagramUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              {LEGAL.instagramHandle}
            </a>
          </li>
          <li>
            <span className="legal-term">Address:</span>{" "}
            <LegalBlank
              value={LEGAL.storeAddress}
              label="office or store address in Ulaanbaatar"
            />
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
