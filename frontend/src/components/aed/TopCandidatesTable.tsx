import type { AedCandidate, OperatingHoursStatus } from "@/lib/aed/types";
import goldMedal from "@/assests/icons/gold-medal.png";
import silverMedal from "@/assests/icons/silver-medal.png";
import bronzeMedal from "@/assests/icons/bronze-medal.png";

const HOURS_LABEL: Record<OperatingHoursStatus, string> = {
  match: "Historical operating-hours match",
  "no-match": "No historical operating-hours match",
  uncertain: "Operating-hours information uncertain",
};

const MEDAL_ICONS = [goldMedal, silverMedal, bronzeMedal];

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
                  <img
                    src={MEDAL_ICONS[index]}
                    alt={`Rank ${index + 1}`}
                    className="h-6 w-6 rounded-full object-contain"
                  />
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
