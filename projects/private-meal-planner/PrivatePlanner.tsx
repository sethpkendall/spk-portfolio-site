"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResponsiveMealDialog from "@/projects/meal-planner/components/ResponsiveMealDialog";
import { authClient } from "@/lib/auth/client";
import {
  addDays,
  Command,
  commandSchema,
  groceryRows,
  localToday,
  mealIngredients,
  mealTypes,
  MealType,
  Plan,
  PrivateGrocery,
  PrivateMeal,
  weekStart,
} from "@/lib/private-planner/domain";

type MealDraft = {
  id?: string;
  date: string;
  type: MealType;
  title: string;
  instructions: string;
  tags: string;
  ingredients: { title: string; quantity: string; unit: string }[];
};
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
const api = "/api/private-meal-planner";

export default function PrivatePlanner() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [week, setWeek] = useState(() => weekStart(localToday()));
  const [draft, setDraft] = useState<MealDraft | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyDestination, setCopyDestination] = useState("");
  const [copyMode, setCopyMode] = useState<"merge" | "replace">("merge");
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);
  const [groceryOpen, setGroceryOpen] = useState(false);
  const [newGrocery, setNewGrocery] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const inFlight = useRef(false);
  const generation = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const readSequence = useRef(0);
  const locked = busy || loading || needsRefresh || !online;
  const editing = Boolean(draft || copyOpen || deleteOpen || groceryOpen);

  function clearPrivateView() {
    generation.current++;
    readSequence.current++;
    setPlan(null);
    setDraft(null);
    setNewGrocery("");
    setCopyOpen(false);
    setGroceryOpen(false);
    setDeleteOpen(false);
    setDeleteText("");
    setNotice("");
    setError("");
    setSignedOut(true);
    setLoading(false);
    setBusy(false);
    setNeedsRefresh(false);
    setCopyDestination("");
    setReplaceConfirmed(false);
  }
  async function load() {
    if (inFlight.current) return;
    const sequence = ++readSequence.current;
    const g = generation.current;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(api, {
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });
      if (g !== generation.current || sequence !== readSequence.current) return;
      if (response.status === 401 || response.status === 403) {
        clearPrivateView();
        return;
      }
      const data = await response.json();
      if (g !== generation.current || sequence !== readSequence.current) return;
      if (!response.ok)
        throw new Error(data.error || "Could not load your plan.");
      setPlan(data.plan);
      setNeedsRefresh(false);
      setSignedOut(false);
    } catch (e) {
      if (g === generation.current)
        setError(e instanceof Error ? e.message : "Could not load your plan.");
    } finally {
      if (g === generation.current && sequence === readSequence.current)
        setLoading(false);
    }
  }
  useEffect(() => {
    setOnline(navigator.onLine);
    void load();
    const onOnline = () => setOnline(navigator.onLine);
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOnline);
    window.addEventListener("pageshow", onPageShow);
    if (typeof BroadcastChannel !== "undefined") {
      channel.current = new BroadcastChannel("private-planner-session");
      channel.current.onmessage = (e) => {
        if (e.data === "signed-out") clearPrivateView();
      };
    }
    return () => {
      generation.current++;
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOnline);
      window.removeEventListener("pageshow", onPageShow);
      channel.current?.close();
    };
    // The initial request runs once; private state is never persisted locally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function mutate(command: Command): Promise<boolean> {
    if (!plan || inFlight.current || needsRefresh || !navigator.onLine)
      return false;
    const parsed = commandSchema.safeParse(command);
    if (!parsed.success) {
      setError(
        "Check the meal name, dates, tags, and each ingredient's positive quantity and unit. Nothing was saved.",
      );
      return false;
    }
    inFlight.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    const g = generation.current;
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: plan.revision,
          command: parsed.data,
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (g !== generation.current) return false;
      if (response.status === 401 || response.status === 403) {
        clearPrivateView();
        return false;
      }
      const data = await response.json();
      if (g !== generation.current) return false;
      if (!response.ok) {
        if (
          response.status === 409 ||
          response.status === 404 ||
          response.status >= 500
        )
          setNeedsRefresh(true);
        setError(data.error || "Save failed. Nothing is confirmed saved.");
        return false;
      }
      setPlan(data.plan);
      setNotice(data.message);
      return true;
    } catch {
      if (g === generation.current) {
        setNeedsRefresh(true);
        setError(
          "Save outcome unknown. Your draft is still here. Copy anything you need, then refresh and review the server plan before another change.",
        );
      }
      return false;
    } finally {
      inFlight.current = false;
      if (g === generation.current) setBusy(false);
    }
  }
  async function signOut() {
    clearPrivateView();
    channel.current?.postMessage("signed-out");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error();
      window.location.replace("/auth/sign-in");
    } catch {
      setError(
        "Your private view is cleared, but server sign-out was not confirmed. Reconnect and retry sign-out.",
      );
    }
  }
  async function exportPlan() {
    const g = generation.current;
    setError("");
    try {
      const response = await fetch(`${api}?export=1`, {
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });
      if (g !== generation.current) return;
      if (response.status === 401 || response.status === 403) {
        clearPrivateView();
        return;
      }
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      if (g !== generation.current) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "private-meal-plan.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      if (g === generation.current)
        setError("Export failed. Please reconnect and try again.");
    }
  }
  function editMeal(meal: PrivateMeal | null, date: string, type: MealType) {
    setError("");
    setDraft({
      id: meal?.id,
      date,
      type,
      title: meal?.title || "",
      instructions: meal?.instructions || "",
      tags: meal?.tags.join(", ") || "",
      ingredients: meal
        ? mealIngredients(plan!, meal.id).map((i) => ({
            ...i,
            quantity: String(i.quantity),
          }))
        : [],
    });
  }
  function prefill(id: string) {
    const meal = plan?.meals.find((m) => m.id === id);
    if (meal && draft)
      setDraft({
        ...draft,
        title: meal.title,
        instructions: meal.instructions,
        tags: meal.tags.join(", "),
        ingredients: mealIngredients(plan!, id).map((i) => ({
          ...i,
          quantity: String(i.quantity),
        })),
      });
  }
  async function saveMeal() {
    if (!draft) return;
    const saved = await mutate({
      action: "saveMeal",
      ...(draft.id ? { id: draft.id } : {}),
      date: draft.date,
      type: draft.type,
      title: draft.title,
      instructions: draft.instructions,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      ingredients: draft.ingredients.map((i) => ({
        ...i,
        quantity: Number(i.quantity),
      })),
    });
    if (saved) setDraft(null);
  }
  function resetAndRefresh() {
    if (
      editing &&
      !window.confirm(
        "Discard unsaved form values and refresh? Copy any draft text you want to keep first.",
      )
    )
      return;
    setDraft(null);
    setCopyOpen(false);
    setDeleteOpen(false);
    setGroceryOpen(false);
    setNewGrocery("");
    void load();
  }
  const feedback = (
    <>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {needsRefresh && (
        <Button
          type="button"
          variant="outline"
          disabled={busy || !online}
          onClick={resetAndRefresh}
        >
          Discard draft and refresh
        </Button>
      )}
    </>
  );

  if (signedOut)
    return (
      <main className="mx-auto max-w-xl space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Private meal planner</h1>
        <p>Sign in with the owner's verified email to view this plan.</p>
        {feedback}
        <Link className="block underline" href="/auth/sign-in">
          Sign in
        </Link>
        <Button variant="outline" onClick={signOut}>
          Retry sign-out
        </Button>
        <Link className="block underline" href="/showcase/meal-planner">
          Open local demo
        </Link>
      </main>
    );

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-700">
            PRIVATE · ONLINE SAVES
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Your meal plan
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            One plan across your devices. Refresh to see changes made elsewhere.
          </p>
          <Link
            className="text-sm underline text-slate-500"
            href="/showcase/meal-planner"
          >
            Separate browser-local demo
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={busy || editing || loading || !online}
            onClick={() => void load()}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            disabled={busy || editing || !plan || !online}
            onClick={exportPlan}
          >
            Export
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>
      {!online && (
        <p role="status" className="rounded-lg bg-amber-50 p-3 text-amber-900">
          You're offline. Reconnect to save; changes are not queued.
        </p>
      )}
      {feedback}
      {notice && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-3 text-emerald-800"
        >
          {notice}
        </p>
      )}
      {loading && <p role="status">Loading your private plan…</p>}
      {plan && (
        <>
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                aria-label="Previous week"
                disabled={busy || editing}
                onClick={() => setWeek(addDays(week, -7))}
              >
                ←
              </Button>
              <h2 className="text-lg font-semibold">
                Week of {formatDate(week)}
              </h2>
              <Button
                variant="outline"
                aria-label="Next week"
                disabled={busy || editing}
                onClick={() => setWeek(addDays(week, 7))}
              >
                →
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={locked || editing}
                onClick={() => {
                  setCopyDestination(addDays(week, 7));
                  setCopyMode("merge");
                  setReplaceConfirmed(false);
                  setCopyOpen(true);
                  setError("");
                }}
              >
                Copy week
              </Button>
              <Button
                disabled={busy || editing}
                onClick={() => setGroceryOpen(true)}
              >
                Groceries
              </Button>
            </div>
          </section>
          {plan.meals.length === 0 && (
            <p className="text-sm text-slate-600">
              Your private plan is empty. Add a meal below; demo meals stay in
              the demo.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
            {Array.from({ length: 7 }, (_, i) => addDays(week, i)).map(
              (date) => (
                <section
                  key={date}
                  className="min-w-0 rounded-xl bg-slate-50 p-3"
                >
                  <h3 className="mb-3 font-semibold">{formatDate(date)}</h3>
                  <div className="space-y-3">
                    {mealTypes.map((type) => {
                      const meal = plan.meals.find(
                        (m) => m.date === date && m.type === type,
                      );
                      return (
                        <article
                          key={type}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            {type}
                          </p>
                          {meal ? (
                            <>
                              <h4 className="mt-2 break-words font-semibold">
                                {meal.title}
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {meal.tags.map((t) => (
                                  <span
                                    className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-800"
                                    key={t}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                              <details className="mt-2 text-sm">
                                <summary className="cursor-pointer">
                                  Details
                                </summary>
                                <ul className="mt-2 space-y-1">
                                  {mealIngredients(plan, meal.id).map(
                                    (x, j) => (
                                      <li key={j}>
                                        {x.quantity} {x.unit} {x.title}
                                      </li>
                                    ),
                                  )}
                                </ul>
                                <p className="mt-2 whitespace-pre-wrap break-words">
                                  {meal.instructions}
                                </p>
                              </details>
                              <Button
                                className="mt-3 w-full"
                                variant="outline"
                                size="sm"
                                aria-label={`Edit ${meal.title}`}
                                disabled={locked || editing}
                                onClick={() => editMeal(meal, date, type)}
                              >
                                Edit
                              </Button>
                            </>
                          ) : (
                            <Button
                              className="mt-3 w-full"
                              size="sm"
                              variant="outline"
                              aria-label={`Add ${type} ${date}`}
                              disabled={locked || editing}
                              onClick={() => editMeal(null, date, type)}
                            >
                              + Add meal
                            </Button>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ),
            )}
          </div>
          <footer className="border-t pt-5 text-sm text-slate-500">
            <p>
              Private changes are saved only after the server confirms them. No
              offline sync.
            </p>
            <button
              className="mt-2 underline"
              disabled={locked || editing}
              onClick={() => {
                setDeleteText("");
                setDeleteOpen(true);
                setError("");
              }}
            >
              Delete all private planner data
            </button>
          </footer>
        </>
      )}

      <ResponsiveMealDialog
        open={Boolean(draft)}
        onOpenChange={(open) => {
          if (
            !open &&
            !busy &&
            (!draft || window.confirm("Discard this unsaved meal draft?"))
          )
            setDraft(null);
        }}
        title={draft?.id ? "Edit meal" : "Add meal"}
        description={draft ? `${formatDate(draft.date)} · ${draft.type}` : ""}
      >
        {draft && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void saveMeal();
            }}
          >
            {feedback}
            <fieldset disabled={busy} className="space-y-4">
              <label className="block text-sm">
                Prefill from a previous meal
                <select
                  aria-label="Prefill from a previous meal"
                  className="mt-1 w-full rounded border bg-white p-2"
                  defaultValue=""
                  onChange={(e) => prefill(e.target.value)}
                >
                  <option value="">Choose a meal…</option>
                  {plan?.meals
                    .slice()
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .filter(
                      (m, i, all) =>
                        all.findIndex((x) => x.title === m.title) === i,
                    )
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                </select>
              </label>
              <label className="block text-sm">
                Meal name
                <Input
                  aria-label="Meal name"
                  value={draft.title}
                  maxLength={200}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  required
                />
              </label>
              <fieldset className="space-y-2">
                <legend className="font-semibold">Ingredients</legend>
                {draft.ingredients.map((i, index) => (
                  <div
                    className="grid grid-cols-[minmax(0,1fr)_4rem_4rem_2rem] gap-2"
                    key={index}
                  >
                    <Input
                      aria-label={`Ingredient ${index + 1} name`}
                      placeholder="Food"
                      value={i.title}
                      required
                      maxLength={200}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          ingredients: draft.ingredients.map((x, j) =>
                            j === index ? { ...x, title: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <Input
                      aria-label={`Ingredient ${index + 1} quantity`}
                      inputMode="decimal"
                      placeholder="Qty"
                      value={i.quantity}
                      required
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          ingredients: draft.ingredients.map((x, j) =>
                            j === index
                              ? { ...x, quantity: e.target.value }
                              : x,
                          ),
                        })
                      }
                    />
                    <Input
                      aria-label={`Ingredient ${index + 1} unit`}
                      placeholder="Unit"
                      value={i.unit}
                      required
                      maxLength={40}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          ingredients: draft.ingredients.map((x, j) =>
                            j === index ? { ...x, unit: e.target.value } : x,
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      aria-label={`Remove ingredient ${index + 1}`}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          ingredients: draft.ingredients.filter(
                            (_, j) => j !== index,
                          ),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      ingredients: [
                        ...draft.ingredients,
                        { title: "", quantity: "1", unit: "" },
                      ],
                    })
                  }
                  disabled={draft.ingredients.length >= 100}
                >
                  Add ingredient
                </Button>
              </fieldset>
              <label className="block text-sm">
                Tags (comma-separated)
                <Input
                  aria-label="Tags"
                  value={draft.tags}
                  onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Instructions
                <textarea
                  aria-label="Instructions"
                  className="mt-1 min-h-28 w-full rounded border p-2"
                  maxLength={20000}
                  value={draft.instructions}
                  onChange={(e) =>
                    setDraft({ ...draft, instructions: e.target.value })
                  }
                />
              </label>
              <div className="flex flex-wrap justify-between gap-2">
                {draft.id && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={locked}
                    onClick={async () => {
                      if (
                        window.confirm(`Delete ${draft.title}?`) &&
                        (await mutate({ action: "deleteMeal", id: draft.id! }))
                      )
                        setDraft(null);
                    }}
                  >
                    Delete meal
                  </Button>
                )}
                <Button type="submit" disabled={locked}>
                  {busy ? "Saving…" : "Save meal"}
                </Button>
              </div>
            </fieldset>
          </form>
        )}
      </ResponsiveMealDialog>
      <ResponsiveMealDialog
        open={copyOpen}
        onOpenChange={(open) => {
          if (!busy) setCopyOpen(open);
        }}
        title="Copy week"
        description="Copy meals, tags, instructions, and ingredients. Grocery checkmarks and overrides are not copied."
      >
        <div className="space-y-4">
          {feedback}
          <label className="block">
            Destination date
            <Input
              aria-label="Destination date"
              type="date"
              value={copyDestination}
              onChange={(e) => setCopyDestination(e.target.value)}
            />
          </label>
          <label className="block">
            Copy behavior
            <select
              aria-label="Copy behavior"
              className="ml-2 rounded border p-2"
              value={copyMode}
              onChange={(e) => {
                setCopyMode(e.target.value as "merge" | "replace");
                setReplaceConfirmed(false);
              }}
            >
              <option value="merge">Merge: keep occupied slots</option>
              <option value="replace">Replace destination meals</option>
            </select>
          </label>
          {copyMode === "replace" && (
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={replaceConfirmed}
                onChange={(e) => setReplaceConfirmed(e.target.checked)}
              />
              I confirm replacement of all destination-week meals.
            </label>
          )}
          <Button
            disabled={
              locked ||
              !copyDestination ||
              (copyMode === "replace" && !replaceConfirmed)
            }
            onClick={async () => {
              if (
                await mutate({
                  action: "copyWeek",
                  source: week,
                  destination: weekStart(copyDestination),
                  mode: copyMode,
                  confirmReplace: replaceConfirmed,
                })
              )
                setCopyOpen(false);
            }}
          >
            Copy meals
          </Button>
        </div>
      </ResponsiveMealDialog>
      <ResponsiveMealDialog
        open={groceryOpen}
        onOpenChange={(open) => {
          if (!busy) setGroceryOpen(open);
        }}
        title="Grocery list"
        description="Matching food names and units combine. Other units stay separate."
      >
        <div className="space-y-4">
          {feedback}
          <form
            className="flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (
                await mutate({
                  action: "addGrocery",
                  weekStart: week,
                  title: newGrocery,
                })
              )
                setNewGrocery("");
            }}
          >
            <Input
              disabled={busy}
              aria-label="New grocery item"
              placeholder="Add an item"
              value={newGrocery}
              onChange={(e) => setNewGrocery(e.target.value)}
              maxLength={200}
              required
            />
            <Button type="submit" disabled={locked}>
              Add
            </Button>
          </form>
          {plan && groceryRows(plan, week).length === 0 && (
            <p>Your grocery list is empty.</p>
          )}
          {plan &&
            groceryRows(plan, week).map((row) => (
              <GroceryEditor
                key={row.sourceKey || row.id}
                row={row}
                busy={busy}
                locked={locked}
                save={async (changes) => {
                  await mutate({
                    action: "setGrocery",
                    weekStart: week,
                    ...(row.id
                      ? { id: row.id }
                      : { sourceKey: row.sourceKey! }),
                    quantity:
                      plan.groceries.find((g) => g.id === row.id)?.quantity ??
                      null,
                    checked: row.checked,
                    removed: false,
                    ...changes,
                  });
                }}
              />
            ))}
        </div>
      </ResponsiveMealDialog>
      <ResponsiveMealDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!busy) setDeleteOpen(open);
        }}
        title="Delete private planner data"
        description="This deletes all cloud meals, ingredients, and grocery data. Your local demo and sign-in account stay intact. Export first if you want a copy."
      >
        <div className="space-y-4">
          {feedback}
          <label className="block">
            Type DELETE PRIVATE PLAN
            <Input
              aria-label="Deletion confirmation"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
            />
          </label>
          <Button
            disabled={locked || deleteText !== "DELETE PRIVATE PLAN"}
            onClick={async () => {
              if (
                await mutate({
                  action: "clear",
                  confirmation: "DELETE PRIVATE PLAN",
                })
              ) {
                setDeleteOpen(false);
                setDeleteText("");
              }
            }}
          >
            Permanently delete private data
          </Button>
        </div>
      </ResponsiveMealDialog>
    </main>
  );
}

function GroceryEditor({
  row,
  busy,
  locked,
  save,
}: {
  row: PrivateGrocery;
  busy: boolean;
  locked: boolean;
  save: (
    changes: Partial<Pick<PrivateGrocery, "quantity" | "checked" | "removed">>,
  ) => Promise<void>;
}) {
  const [qty, setQty] = useState(String(row.quantity ?? ""));
  useEffect(() => setQty(String(row.quantity ?? "")), [row.quantity]);
  return (
    <div className="space-y-2 rounded border p-3">
      <div className="flex items-center justify-between gap-2">
        <label className="flex min-w-0 items-center gap-2">
          <input
            type="checkbox"
            aria-label={`Acquired ${row.title}`}
            checked={row.checked}
            disabled={locked}
            onChange={() => void save({ checked: !row.checked })}
          />
          <span className={row.checked ? "line-through text-slate-500" : ""}>
            {row.title}
          </span>
        </label>
        <Button
          size="sm"
          variant="outline"
          disabled={locked}
          aria-label={`Remove ${row.title}`}
          onClick={() => void save({ removed: true })}
        >
          Remove
        </Button>
      </div>
      {!row.isFreeform && (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const n = Number(qty);
            if (Number.isFinite(n) && n > 0 && n <= 1000000)
              void save({ quantity: n });
          }}
        >
          <Input
            className="w-24"
            disabled={busy}
            aria-label={`${row.title} quantity`}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            inputMode="decimal"
          />
          <span className="text-sm">{row.unit}</span>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={locked || !(Number(qty) > 0) || Number(qty) > 1000000}
          >
            Save quantity
          </Button>
        </form>
      )}
    </div>
  );
}
