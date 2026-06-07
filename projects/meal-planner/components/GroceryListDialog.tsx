"use client";

import { useEffect, useState } from "react";
import { Check, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroceryRow } from "./types";
import ResponsiveMealDialog from "./ResponsiveMealDialog";
import {
  addFreeformGroceryItem,
  generateWeeklyGroceryRows,
  removeGroceryRow,
  saveGroceryOverride,
} from "./mealPlannerData";

type GroceryListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shownWeek: Date;
};

export default function GroceryListDialog({ open, onOpenChange, shownWeek }: GroceryListDialogProps) {
  const [newItem, setNewItem] = useState("");
  const rows = useLiveQuery(
    () => open ? generateWeeklyGroceryRows(shownWeek) : Promise.resolve([]),
    [open, shownWeek]
  );

  const addItem = async () => {
    await addFreeformGroceryItem(shownWeek, newItem);
    setNewItem("");
  };

  return (
    <ResponsiveMealDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Grocery List"
      description="Ingredients are combined when their names and units match. Different units remain separate."
    >
      <div className="space-y-4">
        <form
          className="flex gap-2"
          onSubmit={async event => {
            event.preventDefault();
            await addItem();
          }}
        >
          <Input
            value={newItem}
            onChange={event => setNewItem(event.target.value)}
            placeholder="Add a grocery item"
            aria-label="New grocery item"
          />
          <Button type="submit" size="icon" disabled={!newItem.trim()} aria-label="Add grocery item">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {rows === undefined ? (
          <div className="grid min-h-40 place-items-center text-sm text-slate-500">Loading grocery list...</div>
        ) : rows.length === 0 ? (
          <div className="grid min-h-48 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div>
              <ShoppingBasket className="mx-auto mb-3 h-8 w-8 text-slate-400" />
              <p className="font-semibold text-slate-800">Your grocery list is empty</p>
              <p className="mt-1 text-sm text-slate-500">Add ingredients to meals or create a freeform item above.</p>
            </div>
          </div>
        ) : (
          <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {rows.map(row => (
              <GroceryRowEditor
                key={row.sourceKey ?? `freeform-${row.id}`}
                row={row}
                shownWeek={shownWeek}
              />
            ))}
          </div>
        )}
      </div>
    </ResponsiveMealDialog>
  );
}

type GroceryRowEditorProps = {
  row: GroceryRow;
  shownWeek: Date;
};

function GroceryRowEditor({ row, shownWeek }: GroceryRowEditorProps) {
  const [quantity, setQuantity] = useState(row.quantity === undefined ? "" : String(row.quantity));

  useEffect(() => {
    setQuantity(row.quantity === undefined ? "" : String(row.quantity));
  }, [row.quantity]);

  const persistQuantity = async () => {
    const parsed = getValidQuantity();
    if (parsed === undefined) {
      setQuantity(row.quantity === undefined ? "" : String(row.quantity));
      return;
    }
    await saveGroceryOverride(shownWeek, { ...row, quantity: parsed });
  };

  const getValidQuantity = () => {
    const parsed = Number(quantity);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };

  const toggleChecked = async () => {
    await saveGroceryOverride(shownWeek, {
      ...row,
      quantity: row.isFreeform ? row.quantity : getValidQuantity() ?? row.quantity,
      checked: !row.checked,
    });
  };

  return (
    <div
      className={`grid grid-cols-[2.25rem_minmax(0,1fr)_auto_2.25rem] items-center gap-2 rounded-md border p-2 transition-colors ${
        row.checked ? "border-slate-200 bg-slate-50 text-slate-400" : "border-slate-200 bg-white"
      }`}
    >
      <button
        type="button"
        className={`grid h-8 w-8 place-items-center rounded-md border transition-colors ${
          row.checked
            ? "border-green-600 bg-green-600 text-white"
            : "border-slate-300 bg-white text-transparent hover:border-green-500"
        }`}
        onClick={toggleChecked}
        aria-label={row.checked ? `Mark ${row.title} as needed` : `Mark ${row.title} as acquired`}
      >
        <Check className="h-4 w-4" />
      </button>

      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${row.checked ? "line-through" : ""}`}>{row.title}</p>
        {row.isFreeform && <p className="text-xs text-slate-400">Added item</p>}
      </div>

      {!row.isFreeform && (
        <div className="flex items-center gap-1">
          <Input
            value={quantity}
            onChange={event => setQuantity(event.target.value)}
            onBlur={persistQuantity}
            onKeyDown={event => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
              }
            }}
            className="h-8 w-16 px-2 text-right"
            inputMode="decimal"
            aria-label={`${row.title} quantity`}
          />
          <span className="max-w-20 truncate text-xs text-slate-500">{row.unit}</span>
        </div>
      )}

      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
        onClick={() => removeGroceryRow(shownWeek, row)}
        aria-label={`Remove ${row.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
