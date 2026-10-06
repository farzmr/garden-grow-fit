import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { GARDENS } from "@/components/Garden";
import { Button } from "@/components/ui/button";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/gardens")({
  head: () => ({ meta: [
    { title: "Gardens — Bloom" },
    { name: "description", content: "Explore Bloom's illustrated gardens and choose the one shown on Home." },
    { property: "og:title", content: "Gardens — Bloom" },
    { property: "og:description", content: "Choose a handcrafted garden for your workout blooms." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Gardens,
});

function Gardens() {
  const state = useStore();
  return <div className="space-y-6 px-5 pt-10">
    <header className="space-y-1">
      <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><p className="text-xs font-semibold uppercase">Your collection</p></div>
      <h1 className="font-display text-4xl">Gardens</h1>
      <p className="text-sm text-muted-foreground">Choose where your workout flowers will grow.</p>
    </header>
    <div className="space-y-5">
      {GARDENS.map((garden) => {
        const isMain = state.mainGarden === garden.id;
        return <article key={garden.id} className="overflow-hidden rounded-2xl bg-card shadow-soft">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={garden.image} alt={garden.alt} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover" />
            {isMain && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur"><Check className="h-3.5 w-3.5" /> Main</span>}
          </div>
          <div className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0"><h2 className="font-display text-xl">{garden.name}</h2><p className="mt-1 text-xs text-muted-foreground">{garden.subtitle}</p></div>
            <Button variant={isMain ? "secondary" : "outline"} disabled={isMain} onClick={() => setState(current => ({ ...current, mainGarden: garden.id }))} className="shrink-0">{isMain ? "Selected" : "Set main"}</Button>
          </div>
        </article>;
      })}
    </div>
  </div>;
}