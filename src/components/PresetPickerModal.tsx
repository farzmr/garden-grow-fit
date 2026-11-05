import { useRef, useEffect, useState, useCallback } from "react";
import { Haptics } from "@capacitor/haptics";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PresetPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: number;
  suffix: string;
  step?: number;
  presets: number[];
  min?: number;
  max?: number;
  onSelect: (val: number) => void;
};

const ITEM_HEIGHT = 46;
const VISIBLE_COUNT = 5;
const PADDING_OFFSET = ((VISIBLE_COUNT - 1) / 2) * ITEM_HEIGHT; // 2 * 46 = 92px

export function PresetPickerModal({
  isOpen,
  onClose,
  title,
  value,
  suffix,
  step = 1,
  presets,
  onSelect,
}: PresetPickerModalProps) {
  // Ensure the list is sorted and includes the current value
  const items = Array.from(new Set([...presets, value])).sort((a, b) => a - b);
  const initialIndex = Math.max(0, items.indexOf(value));

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHaptic = useCallback(() => {
    try {
      Haptics.selectionChanged().catch(() => {});
    } catch {}
  }, []);

  // Sync index when modal opens or value changes
  useEffect(() => {
    if (isOpen) {
      const idx = Math.max(0, items.indexOf(value));
      setSelectedIndex(idx);
      // Center scroll position
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = idx * ITEM_HEIGHT;
        }
      });
    }
  }, [isOpen, value, items]);

  const scrollToItem = (index: number, smooth = true) => {
    if (!scrollRef.current) return;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    setSelectedIndex(clamped);
    scrollRef.current.scrollTo({
      top: clamped * ITEM_HEIGHT,
      behavior: smooth ? "smooth" : "auto",
    });
    triggerHaptic();
    onSelect(items[clamped]!);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    isUserScrolling.current = true;
    const scrollTop = scrollRef.current.scrollTop;
    const newIndex = Math.max(
      0,
      Math.min(items.length - 1, Math.round(scrollTop / ITEM_HEIGHT))
    );

    if (newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      triggerHaptic();
      onSelect(items[newIndex]!);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // Snap cleanly when scrolling settles
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 150);
  };

  if (!isOpen) return null;

  const currentValue = items[selectedIndex] ?? value;

  const handleStep = (delta: number) => {
    const nextIndex = Math.max(
      0,
      Math.min(items.length - 1, selectedIndex + delta)
    );
    scrollToItem(nextIndex, true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-sm rounded-t-3xl sm:rounded-3xl border border-[#D0AECF]/40 bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS-style Action Bar */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-card">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-1 py-1"
          >
            Cancel
          </button>
          <h2 className="font-display text-base font-bold text-[#2D1B2E] dark:text-foreground">
            {title}
          </h2>
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="rounded-full bg-[#4A1D45] px-4 py-1 text-xs font-bold text-[#E8DCEB] hover:bg-[#3d1739] shadow-xs cursor-pointer"
          >
            Done
          </Button>
        </div>

        {/* Quick Stepper Controls */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={selectedIndex <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D0AECF]/60 bg-[#FAF7F2] dark:bg-muted text-[#4A1D45] dark:text-foreground hover:bg-[#E8DCEB] active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
            aria-label={`Decrease by ${step}`}
          >
            <Minus className="h-4 w-4 stroke-[2.5]" />
          </button>

          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scroll roller to pick
          </span>

          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={selectedIndex >= items.length - 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D0AECF]/60 bg-[#FAF7F2] dark:bg-muted text-[#4A1D45] dark:text-foreground hover:bg-[#E8DCEB] active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
            aria-label={`Increase by ${step}`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Apple Clock-style Drum Wheel Roller */}
        <div className="relative h-[230px] w-full overflow-hidden select-none bg-gradient-to-b from-card via-background to-card py-0">
          {/* Top and Bottom Fade Vignettes (iOS cylinder perspective) */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-card via-card/85 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/85 to-transparent z-10" />

          {/* Center Selection Lens / Barrel Divider Lines */}
          <div
            className="pointer-events-none absolute inset-x-4 h-[46px] rounded-2xl border-y border-[#4A1D45]/20 dark:border-primary/40 bg-[#4A1D45]/5 dark:bg-primary/10 z-0 flex items-center justify-end pr-8"
            style={{ top: `${PADDING_OFFSET}px` }}
          >
            <span className="text-xs font-bold text-[#4A1D45] dark:text-primary tracking-wide uppercase opacity-80">
              {suffix}
            </span>
          </div>

          {/* Drum Roller Scrollable Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              paddingTop: `${PADDING_OFFSET}px`,
              paddingBottom: `${PADDING_OFFSET}px`,
            }}
            className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth snap-y snap-mandatory relative z-5"
          >
            {items.map((num, i) => {
              const distance = Math.abs(i - selectedIndex);
              const isSelected = i === selectedIndex;

              // iOS 3D wheel curvature simulation
              const opacity =
                distance === 0 ? 1 : distance === 1 ? 0.45 : distance === 2 ? 0.2 : 0.08;
              const scale = distance === 0 ? 1.15 : distance === 1 ? 0.9 : 0.78;
              const rotateX =
                distance === 0 ? 0 : i < selectedIndex ? distance * 18 : -distance * 18;

              return (
                <div
                  key={`${num}-${i}`}
                  onClick={() => scrollToItem(i, true)}
                  style={{
                    height: `${ITEM_HEIGHT}px`,
                    transform: `perspective(300px) rotateX(${rotateX}deg) scale(${scale})`,
                    opacity,
                  }}
                  className={`flex items-center justify-center snap-center cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "font-display text-3xl font-extrabold text-[#4A1D45] dark:text-foreground"
                      : "font-display text-2xl font-normal text-[#4A1D45]/60 dark:text-muted-foreground/60"
                  }`}
                >
                  <span className="tabular-nums pr-6">{num}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Current Selection Bar */}
        <div className="border-t border-border/80 bg-card p-3 text-center">
          <p className="text-sm font-semibold text-[#4A1D45] dark:text-foreground">
            Selected: <span className="font-bold text-base">{currentValue}</span>{" "}
            <span className="text-xs font-normal text-muted-foreground">{suffix}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
