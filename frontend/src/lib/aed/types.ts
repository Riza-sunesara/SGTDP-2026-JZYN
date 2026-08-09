// Shape of a backend response. The UI reads ONLY from this object so
// every component (map, recommendation, baseline, table, explanation) stays
// consistent. 

export type ScenarioInput = {
  location: string;
  dayOfWeek: string; // "Monday".."Sunday" — from the dropdown, always this exact set
  time: string; // "HH:mm"
};

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type OperatingHoursStatus = "match" | "no-match" | "uncertain";

export type FactorScores = {
  distance: number; // 0-100
  operatingHours: number;
  accessibility: number;
  locationConfidence: number;
};

export type AedCandidate = {
  id: string;
  name: string;
  point: GeoPoint;
  distanceMeters: number;
  operatingHours: OperatingHoursStatus;
  /** null = information unavailable in the historical dataset */
  accessibility: string | null;
  /** null = information unavailable in the historical dataset */
  floor: string | null;
  overallScore: number; // 0-100
  factors: FactorScores;
};

export type BaselineComparison = {
  decisionSupport: { label: string; scoreLabel: string };
  distanceBaseline: { label: string; distanceLabel: string };
};

export type ScenarioWarning =
  | "long-distance"
  | "all-candidates-closed"
  | "ambiguous-hours"
  | "low-confidence"
  | "route-unavailable";

export type ScenarioErrorCode =
  "location-not-found" | "location-outside-singapore" | "no-qualifying-aed" | "service-unavailable";

export type ScenarioResult = {
  input: ScenarioInput;
  userPoint: GeoPoint;
  /** null when no candidate can be confidently recommended. */
  recommendation: AedCandidate | null;
  candidates: AedCandidate[];
  /** null when a route could not be generated; recommendation still stands. */
  route: GeoPoint[] | null;
  baseline: BaselineComparison | null;
  /** Structured inputs the explanation text is composed from. */
  explanationFacts: string[];
  warnings: ScenarioWarning[];
};

export type ScenarioError = {
  code: ScenarioErrorCode;
  title: string;
  message: string;
};

export function isScenarioError(value: unknown): value is ScenarioError {
  return typeof value === "object" && value !== null && "code" in value && "title" in value;
}