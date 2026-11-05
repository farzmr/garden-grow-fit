import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PresetPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: number;
  suffix: string;
  step: number;
  presets: number[];
  min?: number;
  max?: number;
  onSelect: (val: number) => void;
};

export function PresetPickerModal({
  isOpen,
  onClose,
  title,
  value,
  suffix,
  step,
  presets,
  min = 0,
  max = 9999,
  onSelect,
}: PresetPickerModalProps) {
  if (!isOpen) return null;

  const handleStep = (delta: number) => {
    // Avoid floating point precision issues (e.g., 5.0 + 0.5 = 5.5)
    const factor = step < 1 ? 10 : 1;
    const currentScaled = Math.round(value * factor);
    const deltaScaled = Math.round(delta * factor);
    const nextVal = Math.max(min, Math.min(max, (currentScaled + deltaScaled) / factor));
    onSelect(nextVal);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="flex flex-col max-h-[85vh] w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-card/90">
          <h2 className="font-display text-lg font-bold text-[#2D1B2E]">{title}</h2>
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

        {/* Big Stepper Value Display */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-[#FAF7F2] dark:bg-muted/30 px-6 py-5">
          <button
            type="button"
            onClick={() => handleStep(-step)}
            disabled={value <= min}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#D0AECF] bg-white text-[#4A1D45] transition-all hover:bg-[#FAF6FA] active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
            aria-label={`Decrease by ${step}`}
          >
            <Minus className="h-5 w-5 stroke-[2.5]" />
          </button>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="font-display text-4xl font-bold tracking-tight text-[#4A1D45]">
              {value}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5E3157]/70">
              {suffix}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleStep(step)}
            disabled={value >= max}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#4A1D45] bg-[#4A1D45] text-white transition-all hover:bg-[#3d1739] active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
            aria-label={`Increase by ${step}`}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Preset numbers (tap to select)
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {presets.map((preset) => {
              const isSelected = preset === value;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSelect(preset)}
                  className={`flex h-11 items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                    isSelected
                      ? "bg-[#4A1D45] text-white shadow-sm ring-2 ring-[#4A1D45]/30 font-extrabold"
                      : "bg-[#F1EEE9] text-[#4A1D45] hover:bg-[#E8DCEB] border border-[#D0AECF]/40"
                  }`}
                >
                  {preset}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-card">
          <Button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-2xl bg-[#4A1D45] text-base font-semibold text-[#E8DCEB] hover:bg-[#3d1739]"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
