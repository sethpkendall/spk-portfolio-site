import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trellis Calendar Adapter | Seth P. Kendall",
  description:
    "Information about Seth Kendall's private Trellis Calendar planning adapter.",
};

export default function TrellisCalendarPage() {
  return (
    <div className="container mx-auto max-w-4xl px-5 pb-20">
      <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-purple-700">
          Personal planning tool
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          Trellis Calendar Adapter
        </h1>

        <div className="space-y-8 text-lg leading-relaxed text-gray-700">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              What it does
            </h2>
            <p>
              The Trellis Calendar Adapter is a private, single-user planning
              tool operated by Seth Kendall. It connects Seth&apos;s Trellis weekly
              planning workflow to his personal Google Calendar.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              How Calendar access is used
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Read a bounded date range from one fixed personal calendar to
                identify scheduling context and conflicts.
              </li>
              <li>
                Create individually reviewed planning events only after an
                explicit approval step.
              </li>
              <li>
                Confirm the authenticated Google account and verify that an
                approved event was created as intended.
              </li>
            </ul>
            <p className="mt-4">
              The adapter does not provide a public service, invite attendees,
              alter recurring series, or run continuous Calendar automation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Data practices
            </h2>
            <p>
              Google account and Calendar data are used only to provide this
              personal planning workflow. Calendar context may be processed by
              the configured AI service provider to generate requested
              planning assistance. The data is not sold, shared with
              advertisers, or used for advertising. Authorization credentials
              are retained only on Seth&apos;s private host and can be revoked at
              any time.
            </p>
          </section>

          <section className="rounded-lg bg-gray-50 p-5">
            <h2 className="mb-3 text-2xl font-semibold text-gray-950">
              Policies and contact
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <Link className="font-semibold text-purple-700" href="/privacy/trellis-calendar">
                Privacy policy
              </Link>
              <Link className="font-semibold text-purple-700" href="/terms/trellis-calendar">
                Terms of service
              </Link>
              <a
                className="font-semibold text-purple-700"
                href="https://www.linkedin.com/in/sethpkendall/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Contact Seth
              </a>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
