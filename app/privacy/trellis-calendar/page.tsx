import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trellis Calendar Privacy Policy | Seth P. Kendall",
  description: "Privacy policy for the private Trellis Calendar Adapter.",
};

export default function TrellisCalendarPrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 pb-20">
      <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple-700">
          Effective September 19, 2026
        </p>
        <h1 className="mb-8 text-4xl font-bold tracking-tight md:text-5xl">
          Trellis Calendar Privacy Policy
        </h1>

        <div className="space-y-8 text-lg leading-relaxed text-gray-700">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">Scope</h2>
            <p>
              This policy applies to the Trellis Calendar Adapter, a private,
              single-user tool operated by Seth Kendall. It does not create
              public user accounts or offer Calendar access to other people.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Google data accessed
            </h2>
            <p className="mb-3">The adapter requests access to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                The authenticated Google account&apos;s email address, used only to
                confirm that it matches the configured account.
              </li>
              <li>
                Events on calendars owned by that account, including event
                identifiers, status, title, description, start and end values,
                time zone, availability, and recurrence identifiers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              How Google data is used
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Read a user-selected planning window of no more than 31 days.</li>
              <li>Identify scheduling context and potential conflicts.</li>
              <li>Create planning events that Seth has explicitly reviewed and approved.</li>
              <li>Verify that approved events exist with the intended details.</li>
            </ul>
            <p className="mt-4">
              The software&apos;s command surface does not provide operations to
              update or delete existing Calendar events, manage calendars or
              access-control lists, add attendees, or create recurring events.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Storage and retention
            </h2>
            <p>
              The OAuth refresh token is stored only on Seth&apos;s private host in
              an owner-restricted file. Short-lived access tokens are used to
              communicate with Google APIs. Calendar reads are processed for
              planning and may appear in the processing context and associated
              conversation records needed to provide requested assistance.
              Local operational records may retain approved event details and
              verification results so that Calendar writes can be audited and
              duplicate creation can be prevented.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Sharing and transfer
            </h2>
            <p>
              Google user data is not sold, rented, shared with advertisers, or
              used to build advertising profiles. Calendar context may be sent
              through OpenClaw to the configured AI model provider (currently
              OpenAI) solely to generate requested planning assistance. Other
              transfers are limited to service providers needed to operate and
              secure this personal workflow.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Revocation and deletion
            </h2>
            <p>
              Access can be revoked through the Google Account third-party
              connections settings. The locally stored authorization token and
              operational records can also be deleted by Seth at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Google API policy
            </h2>
            <p>
              The adapter&apos;s use and transfer of information received from
              Google APIs adheres to the{" "}
              <a
                className="font-semibold text-purple-700"
                href="https://developers.google.com/terms/api-services-user-data-policy"
                rel="noopener noreferrer"
                target="_blank"
              >
                Google API Services User Data Policy
              </a>
              , including its Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Questions
            </h2>
            <p>
              Privacy questions may be sent to the support address displayed on
              the Google OAuth consent screen or through Seth&apos;s{" "}
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
            <Link className="font-semibold text-purple-700" href="/terms/trellis-calendar">
              Terms of service
            </Link>
          </nav>
        </div>
      </article>
    </div>
  );
}
