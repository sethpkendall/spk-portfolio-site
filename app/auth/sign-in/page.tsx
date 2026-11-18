import { authConfigured } from "@/lib/auth/server";
import SignIn from "@/projects/private-meal-planner/SignIn";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Sign in to your private planner",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <SignIn configured={authConfigured()} />;
}
