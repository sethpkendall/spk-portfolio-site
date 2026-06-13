"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Copy } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResponsiveMealDialog from "./ResponsiveMealDialog";
import { copyWeekMeals, countWeekMeals, getWeekStart, weekKey } from "./mealPlannerData";
import { WeekCopyMode, WeekCopyResult } from "./types";

type WeekCopyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceWeek: Date;
  onComplete: (result: WeekCopyResult) => void;
};

export default function WeekCopyDialog({
  open,
  onOpenChange,
  sourceWeek,
  onComplete,
}: WeekCopyDialogProps) {
  const [destinationDate, setDestinationDate] = useState("");
  const [mode, setMode] = useState<WeekCopyMode>("merge");
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceStart = useMemo(() => getWeekStart(sourceWeek), [sourceWeek]);
  const destinationWeek = useMemo(
    () => destinationDate ? getWeekStart(parseLocalDate(destinationDate)) : null,
    [destinationDate]
  );
  const isSelfCopy = destinationWeek
    ? weekKey(destinationWeek) === weekKey(sourceStart)
    : false;
  const destinationMealCount = useLiveQuery(
    () => open && destinationWeek && !isSelfCopy ? countWeekMeals(destinationWeek) : Promise.resolve(0),
    [open, destinationDate, isSelfCopy]
  );
  const sourceMealCount = useLiveQuery(
    () => open ? countWeekMeals(sourceStart) : Promise.resolve(0),
    [open, sourceStart]
  );

  useEffect(() => {
    if (!open) return;
    const nextWeek = new Date(sourceStart);
    nextWeek.setDate(sourceStart.getDate() + 7);
    setDestinationDate(weekKey(nextWeek));
    setMode("merge");
    setError(null);
  }, [open, sourceStart]);

  const submitCopy = async () => {
    if (!destinationWeek || isSelfCopy || sourceMealCount === 0) return;

    try {
      setIsCopying(true);
      setError(null);
      const result = await copyWeekMeals(sourceStart, destinationWeek, mode);
      onComplete(result);
      onOpenChange(false);
    } catch (copyError) {
      setError(copyError instanceof Error ? copyError.message : "Unable to copy this week.");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <ResponsiveMealDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Copy Week"
      description={`Copy meals and ingredients from the week of ${formatWeek(sourceStart)}.`}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="copy-week-destination">Destination date</Label>
          <Input
            id="copy-week-destination"
            type="date"
            value={destinationDate}
            onChange={event => setDestinationDate(event.target.value)}
          />
          {destinationWeek && (
            <p className="text-xs text-slate-500">
              Meals will be copied to the week of {formatWeek(destinationWeek)}.
            </p>
          )}
        </div>

        {isSelfCopy && (
          <Feedback tone="error">Source and destination week are the same.</Feedback>
        )}

        {!isSelfCopy && destinationMealCount !== undefined && destinationMealCount > 0 && (
          <Feedback tone="warning">
            <strong>{destinationMealCount} existing {destinationMealCount === 1 ? "meal" : "meals"}</strong>{" "}
            found in the destination week. Choose how conflicts should be handled.
          </Feedback>
        )}

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-slate-800">Copy behavior</legend>
          <div className="grid grid-cols-2 gap-2">
            <ModeButton
              active={mode === "merge"}
              title="Merge"
              detail="Keep existing meals and fill empty slots."
              onClick={() => setMode("merge")}
            />
            <ModeButton
              active={mode === "replace"}
              title="Replace"
              detail="Remove destination meals before copying."
              onClick={() => setMode("replace")}
            />
          </div>
        </fieldset>

        {sourceMealCount === 0 && (
          <Feedback tone="warning">There are no meals in the source week to copy.</Feedback>
        )}
        {error && <Feedback tone="error">{error}</Feedback>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="gap-2"
            onClick={submitCopy}
            disabled={!destinationWeek || isSelfCopy || sourceMealCount === 0 || isCopying}
          >
            <Copy className="h-4 w-4" />
            {isCopying ? "Copying..." : "Copy Week"}
          </Button>
        </div>
      </div>
    </ResponsiveMealDialog>
  );
}

type ModeButtonProps = {
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
};

function ModeButton({ active, title, detail, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-24 rounded-md border p-3 text-left transition-colors ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-950"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-slate-500">{detail}</span>
    </button>
  );
}

function Feedback({ children, tone }: { children: React.ReactNode; tone: "warning" | "error" }) {
  return (
    <div
      className={`flex gap-2 rounded-md border px-3 py-3 text-sm ${
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatWeek(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
