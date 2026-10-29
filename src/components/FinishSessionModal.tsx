import { useState } from "react";
import { Flower2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowerIcon } from "@/components/FlowerIcon";

const FEELING_EMOJIS = [
  { emoji: "💪", label: "Energized" },
  { emoji: "🔥", label: "Fired up" },
  { emoji: "😌", label: "Centered" },
  { emoji: "😴", label: "Exhausted" },
] as const;

export function FinishSessionModal({
  isOpen,
  flower,
  activityName,
  durationMinutes,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  flower: string;
  activityName: string;
  durationMinutes?: number | undefined;
  onClose: () => void;
  onConfirm: (details: { feelingEmoji?: string; notes?: string }) => void;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: { feelingEmoji?: string; notes?: string } = {};
    if (selectedEmoji) payload.feelingEmoji = selectedEmoji;
    const trimmed = notes.trim();
    if (trimmed) payload.notes = trimmed;
    onConfirm(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl animate-in slide-in-from-bottom-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <FlowerIcon flower={flower} className="h-8 w-8" />
            <div>
              <h2 className="font-display text-xl font-semibold">Finish {activityName}</h2>
              {durationMinutes !== undefined && (
                <p className="text-xs text-muted-foreground">{durationMinutes} min session</p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground">
              How did it feel? (optional)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {FEELING_EMOJIS.map(({ emoji, label }) => {
                const isSelected = selectedEmoji === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(isSelected ? undefined : emoji)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border p-2.5 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    <span
                      className="text-3xl leading-none select-none inline-block my-0.5"
                      style={{
                        fontFamily:
                          '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
                      }}
                      role="img"
                      aria-label={label}
                    >
                      {emoji}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground">
              Session note (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Felt energized, great stretch, good focus..."
              rows={2}
              maxLength={140}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none transition-colors focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-2 pt-1">
            <Button type="submit" className="h-12 w-full gap-2 rounded-2xl text-base font-semibold">
              <Flower2 className="h-5 w-5" />
              Plant my {flower}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Keep going
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
