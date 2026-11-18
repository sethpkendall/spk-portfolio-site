import Link from "next/link";
import { authConfigured } from "@/lib/auth/server";
import PrivatePlanner from "@/projects/private-meal-planner/PrivatePlanner";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private Meal Planner",
  robots: { index: false, follow: false },
};
export default function Page() {
  if (!authConfigured() || !process.env.DATABASE_URL)
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Private meal planner</h1>
        <p className="my-4">Your private planner is not available yet.</p>
        <Link className="underline" href="/showcase/meal-planner">
          Open the browser-local demo
        </Link>
      </main>
    );
  // Public shell only. Every data operation is authenticated by the server API.
  return <PrivatePlanner />;
}
