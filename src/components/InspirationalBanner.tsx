import { useState } from "react";
import { Sparkles } from "lucide-react";
import { getRandomQuote } from "@/lib/quotes";

export function InspirationalBanner({ quote }: { quote?: string }) {
  const [currentQuote] = useState(() => quote ?? getRandomQuote());

  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/10 px-4 py-3.5 text-foreground shadow-sm">
      <Sparkles className="h-5 w-5 shrink-0 text-primary" />
      <p className="font-bold text-sm tracking-wide leading-snug">
        "{currentQuote}"
      </p>
    </div>
  );
}
