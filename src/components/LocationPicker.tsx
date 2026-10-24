import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOCATION_TAGS = [
  { label: "Home", icon: "🏠" },
  { label: "Gym", icon: "🏋️" },
  { label: "Park", icon: "🌳" },
  { label: "Studio", icon: "🧘" },
  { label: "Outdoors", icon: "🌿" },
] as const;

export function LocationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (loc: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Location
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {LOCATION_TAGS.map((tag) => {
          const isSelected = value.toLowerCase() === tag.label.toLowerCase();
          return (
            <Button
              key={tag.label}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(isSelected ? "" : tag.label)}
              className={`h-9 rounded-xl px-3 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <span className="mr-1.5 text-sm">{tag.icon}</span>
              {tag.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
