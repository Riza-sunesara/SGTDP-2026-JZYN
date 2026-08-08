import { Info } from "lucide-react";
import { ScorePill } from "./ScorePill";
import type { ScenarioResult } from "@/lib/aed/types";

export function RecommendationCard({ result }: { result: ScenarioResult }) {
  const rec = result.recommendation;

  if (!rec) {
    return (
      <section
        aria-label="Recommendation"
        className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="text-base font-semibold text-heading">Recommendation</h3>
        {result.explanationFacts.length > 0 && (
          <div className="mt-4 space-y-2 rounded-xl border border-divider bg-white p-4 text-sm leading-relaxed text-foreground">
            {result.explanationFacts.slice(0, 3).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      aria-label="Recommended AED"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-heading">Recommended AED</h3>
          <p className="mt-1 truncate text-sm text-foreground">{rec.name}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-3xl font-semibold leading-none text-primary">{rec.overallScore}%</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-foreground">
            Overall Score
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 min-[420px]:grid-cols-2">
        <ScorePill label="Distance" value={rec.factors.distance} />
        <ScorePill label="Operating Hours" value={rec.factors.operatingHours} />
        <ScorePill label="Accessibility" value={rec.factors.accessibility} />
        <ScorePill label="Location Confidence" value={rec.factors.locationConfidence} />
      </div>

      {result.baseline && (
        <div className="mt-4 border-t border-divider pt-3">
          <h4 className="text-sm font-semibold text-heading">Baseline Comparison</h4>
          <div className="mt-2.5 grid grid-cols-2 gap-3">
            <div className="min-w-0 rounded-xl border border-border bg-white p-3">
              <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-primary">
                Decision Support
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground">
                Our Ranking
              </p>
              <p className="mt-1 truncate text-sm font-medium text-heading">
                {result.baseline.decisionSupport.label}
              </p>
              <p className="truncate text-xs text-foreground">
                {result.baseline.decisionSupport.scoreLabel}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-border bg-white p-3">
              <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-foreground">
                Distance Baseline
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground">
                Nearest Only
              </p>
              <p className="mt-1 truncate text-sm font-medium text-heading">
                {result.baseline.distanceBaseline.label}
              </p>
              <p className="truncate text-xs text-foreground">
                {result.baseline.distanceBaseline.distanceLabel}
              </p>
            </div>
          </div>
        </div>
      )}

      {result.explanationFacts.length > 0 && (
        <div className="mt-4 border-t border-divider pt-3">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold text-heading">
            <Info className="size-4 text-primary" aria-hidden />
            Why this AED?
          </h4>
          <div className="mt-1.5 space-y-1 text-[13px] leading-relaxed text-foreground">
            {result.explanationFacts.slice(0, 3).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
