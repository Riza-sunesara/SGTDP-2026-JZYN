import type { AedCandidate, OperatingHoursStatus } from "@/lib/aed/types";

const HOURS_LABEL: Record<OperatingHoursStatus, string> = {
  match: "Historical operating-hours match",
  "no-match": "No historical operating-hours match",
  uncertain: "Operating-hours information uncertain",
};

/** Gold, silver, bronze medals for ranks 1-3. */
const MEDALS = ["#C9A227", "#8E9AA6", "#A9702E"];

export function TopCandidatesTable({ candidates }: { candidates: AedCandidate[] }) {
  return (
    <section aria-label="Top AED candidates" className="mt-6">
      <h3 className="text-base font-semibold text-heading">Top 3 AED Candidates</h3>
      <p className="mt-1 text-xs text-foreground">
        Ranked from the latest backend response for this scenario.
      </p>

      <div className="mt-4 w-full overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-190 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-divider text-xs uppercase tracking-wide text-foreground">
              <th scope="col" className="px-4 py-3 font-semibold">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                AED Location
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Historical Availability
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Distance
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Accessibility
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Overall Score
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.slice(0, 3).map((candidate, index) => (
              <tr
                key={candidate.id}
                className="border-b border-divider transition-colors last:border-0 hover:bg-muted"
              >
                <td className="px-4 py-3">
                  <span
                    className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                    style={{ background: MEDALS[index] ?? "#94a3b8" }}
                    aria-label={`Rank ${index + 1}`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3 text-heading">{candidate.name}</td>
                <td className="px-4 py-3 text-foreground">{HOURS_LABEL[candidate.operatingHours]}</td>
                <td className="px-4 py-3 text-foreground">{candidate.distanceMeters} m</td>
                <td className="px-4 py-3 text-foreground">{candidate.accessibility}</td>
                <td className="px-4 py-3 font-semibold text-heading">{candidate.overallScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
