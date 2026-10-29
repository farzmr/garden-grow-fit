import { useState } from "react";
import { Plus, Trash2, BookmarkPlus, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanUpdateModal({
  isOpen,
  planName,
  addedExercises,
  removedExercises,
  onUpdatePlan,
  onSaveAsNewPlan,
  onDiscardChanges,
}: {
  isOpen: boolean;
  planName: string;
  addedExercises: string[];
  removedExercises: string[];
  onUpdatePlan: () => void;
  onSaveAsNewPlan: (newPlanName: string) => void;
  onDiscardChanges: () => void;
}) {
  const [isNamingNew, setIsNamingNew] = useState(false);
  const [newPlanName, setNewPlanName] = useState(`${planName} (Updated)`);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-4">
        <div className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Update workout plan?</h2>
          <p className="text-xs text-muted-foreground">
            You modified exercises in <span className="font-semibold text-foreground">&ldquo;{planName}&rdquo;</span>.
          </p>
        </div>

        {/* Change summary */}
        <div className="rounded-2xl border border-border bg-muted/40 p-3.5 space-y-2 text-xs">
          {addedExercises.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.5 shrink-0 text-[11px]">
                <Plus className="h-3 w-3 stroke-[2.5]" /> Added
              </span>
              <span className="text-foreground font-medium pt-0.5 leading-tight">
                {addedExercises.join(", ")}
              </span>
            </div>
          )}

          {removedExercises.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center gap-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-400 font-bold px-1.5 py-0.5 shrink-0 text-[11px]">
                <Trash2 className="h-3 w-3 stroke-[2.5]" /> Removed
              </span>
              <span className="text-foreground font-medium pt-0.5 leading-tight">
                {removedExercises.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Save as new plan input state */}
        {isNamingNew ? (
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-semibold text-muted-foreground">
              New plan name:
              <input
                type="text"
                autoFocus
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="e.g. Leg Day (Modified)"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setIsNamingNew(false)}
              >
                Back
              </Button>
              <Button
                disabled={!newPlanName.trim()}
                className="flex-1 rounded-xl bg-primary text-primary-foreground"
                onClick={() => onSaveAsNewPlan(newPlanName.trim())}
              >
                Save new plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {/* 1. Update Existing Plan */}
            <Button
              className="w-full gap-2 rounded-2xl h-12 text-sm font-semibold bg-primary text-primary-foreground shadow-soft"
              onClick={onUpdatePlan}
            >
              <RefreshCw className="h-4 w-4" />
              Update &ldquo;{planName}&rdquo;
            </Button>

            {/* 2. Save as New Plan */}
            <Button
              variant="outline"
              className="w-full gap-2 rounded-2xl h-12 text-sm font-semibold"
              onClick={() => setIsNamingNew(true)}
            >
              <BookmarkPlus className="h-4 w-4" />
              Save as new plan
            </Button>

            {/* 3. Discard Changes */}
            <Button
              variant="ghost"
              className="w-full gap-1.5 rounded-2xl text-xs text-muted-foreground hover:text-foreground"
              onClick={onDiscardChanges}
            >
              <XCircle className="h-4 w-4" />
              Discard changes (keep original)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
