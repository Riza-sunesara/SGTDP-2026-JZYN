import { AlertTriangle, Info } from "lucide-react";
import { MapCard } from "./MapCard";
import { RecommendationCard } from "./RecommendationCard";
import { TopCandidatesTable } from "./TopCandidatesTable";
import type { ScenarioResult, ScenarioWarning } from "@/lib/aed/types";

const WARNINGS: Record<ScenarioWarning, { title: string; body: string } | null> = {
  "long-distance": {
    title: "Long-distance result",
    body: "This is the nearest qualifying AED identified for this scenario, but it is substantially distant from the selected location.",
  },
  "all-candidates-closed": {
    title: "No operating-hours match",
    body: "No AED with a historical operating-hours match was identified for this simulated time.",
  },
  "ambiguous-hours": {
    title: "Operating-hours information uncertain",
    body: "Some candidates have ambiguous historical operating-hours information. Uncertain hours are never treated as open.",
  },
  "low-confidence": {
    title: "Low-confidence result",
    body: "Some AED information could not be confidently determined from the historical dataset.",
  },
  "route-unavailable": null,
};

export function ResultsSection({ result }: { result: ScenarioResult }) {
  const notices = result.warnings
    .map((warning) => ({ key: warning, content: WARNINGS[warning] }))
    .filter((item): item is { key: ScenarioWarning; content: { title: string; body: string } } =>
      Boolean(item.content),
    );

  return (
    <div className="mt-10">
      {notices.length > 0 && (
        <div className="mb-6 grid gap-3">
          {notices.map(({ key, content }) => (
            <div
              key={key}
              role="status"
              className="flex items-start gap-2.5 rounded-xl border border-(--warning)/45 bg-white p-4"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-heading">{content.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground">{content.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <MapCard
          userPoint={result.userPoint}
          candidates={result.candidates}
          recommendation={result.recommendation}
          route={result.route}
        />
        <RecommendationCard result={result} />
      </div>

      <TopCandidatesTable candidates={result.candidates} />

      <p className="mt-4 flex items-start gap-2 text-xs text-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
        All values shown are simulated results derived from historical dataset information for
        planning and preparedness purposes only.
      </p>
    </div>
  );
}
