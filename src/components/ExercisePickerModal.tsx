import { useState, useMemo } from "react";
import { Search, X, Dumbbell, Plus, Check } from "lucide-react";
import { EXERCISE_LIBRARY, imageFor, type ExerciseCategory } from "@/lib/store";
import { Button } from "@/components/ui/button";

const CATEGORIES: { label: string; value: ExerciseCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Abs / Core", value: "Core" },
  { label: "Arms", value: "Arms" },
  { label: "Chest", value: "Chest" },
  { label: "Back", value: "Back" },
  { label: "Legs", value: "Legs" },
  { label: "Shoulders", value: "Shoulders" },
  { label: "Cardio", value: "Cardio" },
];

export function ExercisePickerModal({
  isOpen,
  onClose,
  onSelect,
  excludeNames = [],
  title = "Add Exercise",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (name: string) => void;
  excludeNames?: string[];
  title?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | "All">("All");

  const filteredExercises = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISE_LIBRARY.filter((ex) => {
      // Category filter
      if (selectedCategory !== "All" && ex.category !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const nameMatch = ex.name.toLowerCase().includes(q);
      const catMatch = ex.category?.toLowerCase().includes(q);
      const absMatch = (q === "abs" || q === "ab" || q === "core") && ex.category === "Core";
      const tipMatch = ex.tip?.toLowerCase().includes(q);

      return nameMatch || catMatch || absMatch || tipMatch;
    });
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  const handleSelect = (name: string) => {
    onSelect(name);
    setQuery("");
    onClose();
  };

  const trimmedQuery = query.trim();
  const isExactMatch = EXERCISE_LIBRARY.some(
    (e) => e.name.toLowerCase() === trimmedQuery.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="flex flex-col h-[85vh] sm:h-[80vh] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="p-4 border-b border-border space-y-3 bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercise, abs, arms, chest..."
              className="w-full rounded-2xl border border-input bg-muted/50 py-2.5 pl-9 pr-9 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`shrink-0 rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-border/40">
          {trimmedQuery && !isExactMatch && (
            <div className="pb-2">
              <button
                type="button"
                onClick={() => handleSelect(trimmedQuery)}
                className="flex items-center justify-between w-full p-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Add &ldquo;{trimmedQuery}&rdquo;</p>
                    <p className="text-xs text-muted-foreground">Custom exercise</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary px-3 py-1 rounded-xl bg-primary/15">Add</span>
              </button>
            </div>
          )}

          {filteredExercises.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Dumbbell className="h-10 w-10 mx-auto opacity-40" />
              <p className="text-sm font-medium">No exercises found</p>
              <p className="text-xs opacity-75">Try a different search term or category</p>
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const isExcluded = excludeNames.includes(ex.name);
              const categoryLabel = ex.category === "Core" ? "Abs / Core" : ex.category;

              return (
                <div
                  key={ex.name}
                  className={`pt-2 first:pt-0 ${isExcluded ? "opacity-60" : ""}`}
                >
                  <button
                    type="button"
                    disabled={isExcluded}
                    onClick={() => handleSelect(ex.name)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl p-2.5 transition-all hover:bg-muted/60 text-left disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Exercise Picture */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/50">
                        {ex.image ? (
                          <img
                            src={ex.image}
                            alt={ex.name}
                            width={56}
                            height={56}
                            loading="lazy"
                            className="h-full w-full object-contain p-0.5"
                          />
                        ) : (
                          <Dumbbell className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>

                      {/* Name & Tags */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-sm text-[#2D1B2E] dark:text-foreground">
                            {ex.name}
                          </span>
                          {categoryLabel && (
                            <span className="inline-flex items-center rounded-md border border-[#D0AECF]/50 bg-[#E8DCEB] px-1.5 py-0.5 text-[10px] font-bold text-[#4A1D45]">
                              {categoryLabel}
                            </span>
                          )}
                        </div>
                        {ex.tip && (
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                            {ex.tip}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div className="shrink-0 pl-1">
                      {isExcluded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                          <Check className="h-3 w-3" /> In plan
                        </span>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8DCEB] text-[#4A1D45] transition-transform group-hover:scale-105">
                          <Plus className="h-5 w-5 stroke-[2.2]" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
