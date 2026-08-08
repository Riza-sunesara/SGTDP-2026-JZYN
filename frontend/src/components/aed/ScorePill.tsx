type Props = {
  label: string;
  value: number;
};

export function ScorePill({ label, value }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5">
        <span className="truncate text-[11px] font-medium text-heading">{label}</span>
        <span className="shrink-0 text-[11px] font-semibold text-primary">{pct}%</span>
      </div>
      <div
        role="meter"
        aria-label={`${label} factor score`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--divider)]"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
