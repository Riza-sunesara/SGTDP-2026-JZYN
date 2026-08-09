import { useMemo } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer } from "react-leaflet";
import type { AedCandidate, GeoPoint } from "@/lib/aed/types";
import "leaflet/dist/leaflet.css";

type Props = {
  userPoint: GeoPoint;
  candidates: AedCandidate[];
  recommendation: AedCandidate | null;
  route: GeoPoint[] | null;
};

export function MapCard({ userPoint, candidates, recommendation, route }: Props) {
  const remainingCandidates = useMemo(
    () => candidates.filter((candidate) => candidate.id !== recommendation?.id),
    [candidates, recommendation],
  );

  const points = useMemo(
    () => [
      userPoint,
      ...remainingCandidates.map((candidate) => candidate.point),
      ...(recommendation ? [recommendation.point] : []),
    ],
    [remainingCandidates, recommendation, userPoint],
  );

  const center = useMemo(() => {
    if (points.length === 0) {
      return [1.3, 103.8] as [number, number];
    }

    const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
    const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
    return [lat, lng] as [number, number];
  }, [points]);

  return (
    <section
      aria-label="Scenario map"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h3 className="truncate text-base font-semibold text-heading">Scenario Map</h3>
        <span className="shrink-0 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-primary">
          Estimated straight-line distance
        </span>
      </div>

      <div className="relative mt-4 min-h-72 w-full flex-1 overflow-hidden rounded-xl border border-divider">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom
          className="relative h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CircleMarker
            center={[userPoint.lat, userPoint.lng]}
            radius={9}
            pathOptions={{ color: "#0f766e", fillColor: "#0f766e", fillOpacity: 0.95 }}
          >
            <Popup>Requested location</Popup>
          </CircleMarker>

          {recommendation && (
            <CircleMarker
              center={[recommendation.point.lat, recommendation.point.lng]}
              radius={9}
              pathOptions={{ color: "#db1c1c", fillColor: "#db1c1c", fillOpacity: 0.95 }}
            >
              <Popup>{recommendation.name}</Popup>
            </CircleMarker>
          )}

          {remainingCandidates.map((candidate) => (
            <CircleMarker
              key={candidate.id}
              center={[candidate.point.lat, candidate.point.lng]}
              radius={7}
              pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.8 }}
            >
              <Popup>{candidate.name}</Popup>
            </CircleMarker>
          ))}

          {route && route.length >= 2 && (
            <Polyline
              positions={route.map((point) => [point.lat, point.lng])}
              pathOptions={{ color: "#d9f00d", weight: 3, dashArray: "6 4", opacity: 0.8 }}
            />
          )}
        </MapContainer>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-foreground">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#0f766e]" aria-hidden /> Requested location
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#db1c1c]" aria-hidden /> Recommended AED
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#16a34a]" aria-hidden /> Other candidates
        </li>
      </ul>

      <p className="mt-3 rounded-lg border border-(--warning)/40 bg-white px-3 py-2 text-xs font-medium text-warning">
        {route && route.length >= 2
          ? "This line is an estimated straight-line distance between points, not a street-routing path."
          : "No straight-line route was returned for this scenario."}
      </p>
    </section>
  );
}
