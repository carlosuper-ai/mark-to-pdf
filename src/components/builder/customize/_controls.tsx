import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 mt-1">
      {children}
    </p>
  );
}

export function OptionGrid({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
}) {
  const gridCols = cols === 3 ? "grid-cols-3" : cols === 1 ? "grid-cols-1" : "grid-cols-2";
  return (
    <div className={cn("grid gap-1.5", gridCols)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md border px-2 py-1.5 text-xs text-center transition-colors hover:border-primary/60",
            value === o.value
              ? "border-primary bg-primary/5 font-medium text-primary"
              : "border-border bg-card text-foreground/70",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <Label className="text-xs">{label}</Label>
        <span className="text-muted-foreground tabular-nums">{display ?? value}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="h-4"
      />
    </div>
  );
}

export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs">{label}</Label>
      <label className="flex items-center gap-2 cursor-pointer">
        <div
          className="h-6 w-6 rounded border border-border shadow-sm"
          style={{ background: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="text-xs text-muted-foreground font-mono">{value}</span>
      </label>
    </div>
  );
}

export function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
