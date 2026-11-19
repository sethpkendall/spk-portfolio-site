"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignIn({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit() {
    if (busy || !configured) return;
    setBusy(true);
    setError("");
    try {
      const result = sent
        ? await authClient.signIn.emailOtp({
            email: email.trim(),
            otp: code.trim(),
          })
        : await authClient.emailOtp.sendVerificationOtp({
            email: email.trim(),
            type: "sign-in",
          });
      if (result.error)
        throw new Error(
          result.error.message || "Sign-in failed. Please try again.",
        );
      if (sent) window.location.replace("/meal-planner");
      else setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in could not complete.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto max-w-md space-y-6 px-5 py-12">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          PRIVATE · OWNER ONLY
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Your meal planner</h1>
        <p className="mt-3 text-slate-600">
          Sign in with a one-time email code. Your private plan is separate from
          the browser-local demo.
        </p>
      </div>
      {!configured ? (
        <p role="status">Private sign-in is not available yet.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <label className="block space-y-1">
            Email
            <Input
              aria-label="Email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={sent || busy}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {sent && (
            <>
              <p role="status" className="text-sm">
                Check your email for a sign-in code.
              </p>
              <label className="block space-y-1">
                Email code
                <Input
                  aria-label="Email code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </label>
            </>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={busy}>
            {busy ? "Please wait…" : sent ? "Sign in" : "Send sign-in code"}
          </Button>
          {sent && (
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => {
                setSent(false);
                setCode("");
                setError("");
              }}
            >
              Use another email or send a new code
            </Button>
          )}
        </form>
      )}
      <Link href="/showcase/meal-planner" className="private-demo-link block text-sm">
        Use the local demo without signing in
      </Link>
    </main>
  );
}
