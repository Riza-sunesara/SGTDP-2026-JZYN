import { MapPin, HeartPulse, Navigation } from "lucide-react";
import type { AedCandidate, GeoPoint } from "@/lib/aed/types";

type Props = {
  userPoint: GeoPoint;
  candidates: AedCandidate[];
  recommendation: AedCandidate | null;
  route: GeoPoint[] | null;
};

/**
 * Mock map surface. The prop shape matches what a Leaflet/OpenStreetMap
 * implementation will need (points + a single route polyline).
 */
export function MapCard({ userPoint, candidates, recommendation, route }: Props) {
  const points = [userPoint, ...candidates.map((c) => c.point)];
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const pad = 0.0015;
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad;
  const maxLng = Math.max(...lngs) + pad;

  const project = (p: GeoPoint) => ({
    left: `${((p.lng - minLng) / (maxLng - minLng)) * 100}%`,
    top: `${(1 - (p.lat - minLat) / (maxLat - minLat)) * 100}%`,
  });

  const routePath = route
    ?.map((p, i) => {
      const x = ((p.lng - minLng) / (maxLng - minLng)) * 100;
      const y = (1 - (p.lat - minLat) / (maxLat - minLat)) * 100;
      return `${i === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");

  return (
    <section
      aria-label="Scenario map"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h3 className="truncate text-base font-semibold text-heading">Simulation Map</h3>
        <span className="shrink-0 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-primary">
          Visualization only
        </span>
      </div>

      <div className="relative mt-4 min-h-[240px] w-full flex-1 overflow-hidden rounded-xl border border-divider bg-[color:var(--muted)]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <g stroke="#d3ecee" strokeWidth="2.5" fill="none">
            <path d="M0 22 H100" />
            <path d="M0 55 H100" />
            <path d="M0 82 H100" />
            <path d="M20 0 V100" />
            <path d="M55 0 V100" />
            <path d="M82 0 V100" />
          </g>
          {routePath && (
            <path
              d={routePath}
              fill="none"
              stroke="#0b6470"
              strokeWidth="1.6"
              strokeDasharray="3 2.4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        <div
          style={project(userPoint)}
          className="absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary shadow"
          title="Simulated test location"
        >
          <Navigation className="size-4 text-primary-foreground" aria-hidden />
        </div>

        {candidates.map((candidate) => {
          const isTop = recommendation?.id === candidate.id;
          return (
            <div
              key={candidate.id}
              style={project(candidate.point)}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              title={candidate.name}
            >
              <span
                className={
                  isTop
                    ? "flex size-9 items-center justify-center rounded-full border-2 border-white bg-[color:var(--success)] shadow-lg"
                    : "flex size-7 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm"
                }
              >
                {isTop ? (
                  <MapPin className="size-4 text-white" aria-hidden />
                ) : (
                  <HeartPulse className="size-3.5" aria-hidden />
                )}
              </span>
              {isTop && (
                <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-heading shadow-sm">
                  Rank #1
                </span>
              )}
            </div>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-primary" aria-hidden /> Test location
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[color:var(--success)]" aria-hidden />{" "}
          Recommended AED
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-border bg-white" aria-hidden />{" "}
          Candidate AED
        </li>
      </ul>

      {!route && (
        <p className="mt-3 rounded-lg border border-[color:var(--warning)]/40 bg-white px-3 py-2 text-xs font-medium text-[color:var(--warning)]">
          Route could not be generated for this scenario.
        </p>
      )}
    </section>
  );
}
