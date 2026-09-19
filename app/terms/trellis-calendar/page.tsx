import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trellis Calendar Terms of Service | Seth P. Kendall",
  description: "Terms of service for the private Trellis Calendar Adapter.",
};

export default function TrellisCalendarTermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 pb-20">
      <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple-700">
          Effective September 19, 2026
        </p>
        <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
          Trellis Calendar Terms of Service
        </h1>

        <div className="space-y-8 text-lg leading-relaxed text-gray-700">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Personal-use software
            </h2>
            <p>
              The Trellis Calendar Adapter is a private tool created and
              operated by Seth Kendall for his own planning workflow. It is not
              offered as a public or commercial service, and it does not accept
              registrations from other users.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Authorized use
            </h2>
            <p>
              The adapter may access only the Google account intentionally
              authorized by Seth and may use that access only for the purposes
              described on the app page and in the privacy policy. Access may
              be revoked at any time through Google Account settings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Calendar changes
            </h2>
            <p>
              Calendar writes are disabled by default. Each batch of new
              planning events requires a complete preview and explicit approval
              before it can be applied. The adapter does not offer commands to
              update or delete existing events.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Availability and responsibility
            </h2>
            <p>
              The adapter is provided for personal use without a guarantee of
              uninterrupted availability. Seth remains responsible for
              reviewing proposed Calendar changes and maintaining access to his
              Google account and local system.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Changes to these terms
            </h2>
            <p>
              These terms may be updated if the adapter&apos;s capabilities or data
              practices change. The effective date above identifies the current
              version.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">Contact</h2>
            <p>
              Questions may be sent to the support address displayed on the
              Google OAuth consent screen or through Seth&apos;s{" "}
              <a
                className="font-semibold text-purple-700"
                href="https://www.linkedin.com/in/sethpkendall/"
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn profile
              </a>
              .
            </p>
          </section>

          <nav className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:gap-6">
            <Link className="font-semibold text-purple-700" href="/trellis-calendar">
              Trellis Calendar Adapter
            </Link>
            <Link className="font-semibold text-purple-700" href="/privacy/trellis-calendar">
              Privacy policy
            </Link>
          </nav>
        </div>
      </article>
    </div>
  );
}
