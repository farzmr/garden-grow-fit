import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronRight, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXERCISE_LIBRARY, lastFor, useStore, type ExerciseCategory } from "@/lib/store";

export const Route = createFileRoute("/exercises")({
  head: () => ({
    meta: [
      { title: "Gym exercises — Bloom" },
      { name: "description", content: "Browse gym exercises and see your personal weight history for each." },
      { property: "og:title", content: "Gym exercises — Bloom" },
      { property: "og:description", content: "Your exercise library and individual lifting progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Exercises,
});

const CATEGORIES: ("All" | ExerciseCategory)[] = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
];

function Exercises() {
  const s = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | ExerciseCategory>("All");

  const libraryMap = useMemo(() => {
    return new Map(EXERCISE_LIBRARY.map((e) => [e.name, e]));
  }, []);

  const names = useMemo(() => {
    return [
      ...new Set([
        ...EXERCISE_LIBRARY.map((e) => e.name),
        ...s.sessions.flatMap((x) => x.exercises.map((e) => e.name)),
        ...Object.values(s.plan).flatMap((x) => x.map((e) => e.name)),
      ]),
    ].sort();
  }, [s.sessions, s.plan]);

  const filtered = useMemo(() => {
    return names.filter((name) => {
      const info = libraryMap.get(name);
      if (category !== "All" && info?.category !== category) {
        return false;
      }
      if (query.trim() && !name.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [names, libraryMap, category, query]);

  return (
    <div className="space-y-5 px-5 pt-10">
      <h1 className="font-display text-4xl">Exercises</h1>

      <label className="flex items-center gap-2 rounded-xl border border-input bg-card px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          aria-label="Search exercises"
          placeholder="Search exercises"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
        />
      </label>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <Button
              key={cat}
              size="sm"
              variant={isSelected ? "default" : "secondary"}
              onClick={() => setCategory(cat)}
              className="h-8 shrink-0 rounded-full px-3 text-xs"
            >
              {cat}
            </Button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} exercises</p>

      <div className="divide-y divide-border">
        {filtered.map((name) => {
          const info = libraryMap.get(name);
          const last = lastFor(s.sessions, name);
          return (
            <Link
              key={name}
              to="/exercise/$name"
              params={{ name }}
              className="flex items-center gap-3 py-3"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card">
                {info?.image ? (
                  <img
                    src={info.image}
                    alt={name}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Dumbbell className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="break-words text-sm font-semibold">{name}</h2>
                  {info?.category && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {info.category}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {last ? `${last.best} ${last.unit ?? "lb"} · ${last.date}` : "Not trained yet"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      {!filtered.length && (
        <p className="py-6 text-center text-sm text-muted-foreground">No matching exercises.</p>
      )}
    </div>
  );
}
