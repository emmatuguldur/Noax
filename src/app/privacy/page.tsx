import type { Metadata } from "next";

import LegalBlank from "@/components/LegalBlank";
import PageShell from "@/components/PageShell";
import { LEGAL } from "@/data/legal";

/**
 * The real policy, replacing the placeholder that had been holding this route
 * open. Written against the Law on Personal Data Protection of Mongolia (2021).
 *
 * This page has the hardest deadline on the site: the moment the shop takes an
 * order, an email address, or loads a processor's cookies, a policy that matches
 * what the site actually does is required. So two things are worth checking
 * against reality rather than against this text, because neither is something
 * markup can be right or wrong about:
 *
 *  - Section 2 lists what is collected, section 4 who it is shared with, and
 *    section 7 says the Site uses cookies. Those describe an operating shop. If
 *    a category here isn't collected yet, or an analytics script lands later
 *    that isn't named here, the document is wrong in the direction that gets
 *    noticed.
 *  - Like `/terms`, this is Mongolian law only. There is no GDPR/UK-GDPR
 *    language — no lawful-basis-per-purpose table in their sense, no retention
 *    periods, no transfer mechanism. Selling into the EU or UK needs that, and
 *    needs a lawyer.
 *
 * `noindex` stays until the `LegalBlank` facts in `src/data/legal.ts` are
 * filled. Remove it in the same commit as the last blank, here and on `/terms`.
 */

export const metadata: Metadata = {
  title: "Privacy Policy — N.O.U.X",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <PageShell eyebrow="Legal" title="Privacy Policy">
      <p className="legal-updated">Last updated — {LEGAL.lastUpdated}</p>

      <p>
        <span className="legal-term">N.O.U.X</span> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) is committed to protecting the privacy and security of your
        personal data. This Privacy Policy describes how we collect, process, and protect
        your information when you visit our website{" "}
        <LegalBlank value={LEGAL.siteUrl} label="website address" /> (the
        &ldquo;Site&rdquo;) or make a purchase, in full compliance with the{" "}
        <span className="legal-term">
          Law on Personal Data Protection of Mongolia (2021)
        </span>
        .
      </p>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">01</span>
          Data controller information
        </h2>
        <p>
          The data controller responsible for your personal information is{" "}
          <LegalBlank value={LEGAL.entity} label="registered legal entity name" />, a
          company registered in Mongolia with its principal office at{" "}
          <LegalBlank value={LEGAL.registeredAddress} label="registered office address" />.
          If you have any questions regarding your data, you may contact our Data
          Protection Officer at{" "}
          <a className="legal-link" href={`mailto:${LEGAL.email}`}>
            {LEGAL.email}
          </a>
          .
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">02</span>
          Information we collect
        </h2>
        <p>
          We collect personal data that you voluntarily provide to us and data that is
          collected automatically through your use of the Site. The categories of data we
          collect are outlined in the table below:
        </p>
        <div className="legal-table-wrap">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Specific data points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Identity data</th>
                <td>Full name, date of birth (optional), and gender.</td>
              </tr>
              <tr>
                <th scope="row">Contact data</th>
                <td>
                  Delivery address, billing address, email address, and phone number.
                </td>
              </tr>
              <tr>
                <th scope="row">Financial data</th>
                <td>
                  Payment method details (processed via secure third-party providers).
                </td>
              </tr>
              <tr>
                <th scope="row">Transaction data</th>
                <td>
                  Details about products purchased, order history, and payment status.
                </td>
              </tr>
              <tr>
                <th scope="row">Technical data</th>
                <td>IP address, browser type, time zone settings, and device information.</td>
              </tr>
              <tr>
                <th scope="row">Marketing data</th>
                <td>Your preferences in receiving marketing communications from us.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">03</span>
          Legal basis and purpose of processing
        </h2>
        <p>
          In accordance with the{" "}
          <span className="legal-term">Law on Personal Data Protection</span>, we process
          your data only when we have a valid legal basis. Most commonly, we use your data
          for the following purposes:
        </p>
        <ol className="legal-clauses" role="list">
          <li className="legal-clause">
            <span className="legal-num">1.</span>
            <span className="legal-term">Contractual necessity.</span> To process and
            fulfil your orders, including delivery coordination and customer support.
          </li>
          <li className="legal-clause">
            <span className="legal-num">2.</span>
            <span className="legal-term">Consent.</span> To send you marketing newsletters
            or promotional offers (which you may withdraw at any time).
          </li>
          <li className="legal-clause">
            <span className="legal-num">3.</span>
            <span className="legal-term">Legal obligation.</span> To comply with Mongolian
            tax, accounting, and consumer protection laws.
          </li>
          <li className="legal-clause">
            <span className="legal-num">4.</span>
            <span className="legal-term">Legitimate interests.</span> To improve our
            website functionality, analyse user trends, and ensure the security of our
            services.
          </li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">04</span>
          Data sharing and third parties
        </h2>
        <p>
          We do not sell your personal data to third parties. However, we may share your
          information with trusted service providers to facilitate our operations:
        </p>
        <ul className="legal-list" role="list">
          <li>
            <span className="legal-term">Logistics partners:</span> courier services in
            Ulaanbaatar and rural provinces to deliver your orders.
          </li>
          <li>
            <span className="legal-term">Payment processors:</span> secure gateways to
            handle financial transactions (e.g., QPay, local banks).
          </li>
          <li>
            <span className="legal-term">Technical service providers:</span> hosting and
            analytics providers who help maintain the Site.
          </li>
          <li>
            <span className="legal-term">Legal authorities:</span> when required by the
            laws of Mongolia to protect our rights or comply with judicial proceedings.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">05</span>
          Data security and storage
        </h2>
        <p>
          We implement rigorous technical and organisational security measures to protect
          your personal data against unauthorised access, loss, or alteration. These
          measures include encrypted connections (SSL), restricted access to personal
          databases, and regular security audits. Your data is stored on secure servers
          located in{" "}
          <LegalBlank
            value={LEGAL.dataLocation}
            label="hosting region, e.g. Mongolia or Singapore"
          />{" "}
          for as long as necessary to fulfil the purposes for which it was collected or to
          comply with legal retention requirements.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">06</span>
          Your rights as a data subject
        </h2>
        <p>
          Under the{" "}
          <span className="legal-term">
            Law on Personal Data Protection of Mongolia
          </span>
          , you have specific rights regarding your personal information:
        </p>
        <ul className="legal-list" role="list">
          <li>
            <span className="legal-term">Right to access:</span> you may request a copy of
            the personal data we hold about you.
          </li>
          <li>
            <span className="legal-term">Right to rectification:</span> you may request
            that we correct any inaccurate or incomplete data.
          </li>
          <li>
            <span className="legal-term">Right to erasure:</span> you may request the
            deletion of your data when it is no longer necessary for the purposes
            collected.
          </li>
          <li>
            <span className="legal-term">Right to withdraw consent:</span> where processing
            is based on consent, you may withdraw it at any time.
          </li>
          <li>
            <span className="legal-term">Right to complain:</span> you have the right to
            lodge a complaint with the{" "}
            <span className="legal-term">
              National Human Rights Commission of Mongolia
            </span>{" "}
            or relevant data protection authorities if you believe your rights have been
            violated.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">07</span>
          Cookies and tracking technologies
        </h2>
        <p>
          Our Site uses cookies to enhance your browsing experience, remember items in your
          shopping cart, and analyse site traffic. You can manage your cookie preferences
          through your browser settings. Please note that disabling certain cookies may
          limit your ability to use specific features of the Site.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">08</span>
          Children&rsquo;s privacy
        </h2>
        <p>
          Our Site is not intended for individuals under the age of 18. We do not knowingly
          collect personal data from minors. If we become aware that a minor has provided
          us with personal data without parental consent, we will take immediate steps to
          delete such information in accordance with Mongolian law.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">09</span>
          Changes to this policy
        </h2>
        <p>
          We may update this Privacy Policy periodically to reflect changes in our
          practices or legal requirements. Any updates will be posted on this page with a
          revised &ldquo;Last updated&rdquo; date. We encourage you to review this policy
          regularly.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">
          <span className="legal-h-num">10</span>
          Contact us
        </h2>
        <p>
          To exercise your rights or if you have any questions about this policy, please
          reach out to us:
        </p>
        <ul className="legal-list" role="list">
          <li>
            <span className="legal-term">Email:</span>{" "}
            <a className="legal-link" href={`mailto:${LEGAL.email}`}>
              {LEGAL.email}
            </a>
          </li>
          <li>
            <span className="legal-term">Phone:</span>{" "}
            <LegalBlank value={LEGAL.phone} label="published phone number" />
          </li>
          <li>
            <span className="legal-term">Office address:</span>{" "}
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
