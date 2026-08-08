import type { AedCandidate, ScenarioError, ScenarioInput, ScenarioResult } from "./types";

// ---------------------------------------------------------------------------
// Mock service layer. Replace the body of `analyzeScenario` with a `fetch`
// call to the backend; the returned `ScenarioResult` contract stays identical.
// ---------------------------------------------------------------------------

const USER_POINT = { lat: 1.3005, lng: 103.8388 };

const BASE_CANDIDATES: AedCandidate[] = [
  {
    id: "aed-1",
    name: "Orchard Central — Level 1 Lobby",
    point: { lat: 1.3011, lng: 103.8402 },
    distanceMeters: 180,
    operatingHours: "match",
    accessibility: "Public lobby, step-free access",
    floor: "Level 1",
    overallScore: 91,
    factors: {
      distance: 88,
      operatingHours: 96,
      accessibility: 84,
      locationConfidence: 92,
    },
  },
  {
    id: "aed-2",
    name: "Somerset MRT — Station Concourse",
    point: { lat: 1.3002, lng: 103.8365 },
    distanceMeters: 420,
    operatingHours: "match",
    accessibility: "Concourse level, near control station",
    floor: "Basement 1",
    overallScore: 78,
    factors: {
      distance: 74,
      operatingHours: 90,
      accessibility: 72,
      locationConfidence: 80,
    },
  },
  {
    id: "aed-3",
    name: "Cairnhill Community Club",
    point: { lat: 1.3036, lng: 103.8354 },
    distanceMeters: 610,
    operatingHours: "uncertain",
    accessibility: null,
    floor: null,
    overallScore: 64,
    factors: {
      distance: 61,
      operatingHours: 48,
      accessibility: 50,
      locationConfidence: 70,
    },
  },
];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function buildResult(input: ScenarioInput): ScenarioResult {
  const candidates = clone(BASE_CANDIDATES);
  const recommendation = candidates[0]!;

  return {
    input,
    userPoint: USER_POINT,
    recommendation,
    candidates,
    route: [
      USER_POINT,
      { lat: 1.3008, lng: 103.8394 },
      { lat: 1.301, lng: 103.8399 },
      recommendation.point,
    ],
    baseline: {
      decisionSupport: {
        label: recommendation.name,
        scoreLabel: `Score: ${recommendation.overallScore}%`,
      },
      distanceBaseline: {
        label: candidates[1]!.name,
        distanceLabel: `Distance: ${candidates[1]!.distanceMeters} m`,
      },
    },
    explanationFacts: [],
    warnings: [],
  };
}

/**
 * Demo keywords let the prototype show every specified state without a backend.
 * Remove this switch when the real API is connected.
 */
function scenarioKeyword(location: string) {
  return location.trim().toLowerCase();
}

export async function analyzeScenario(input: ScenarioInput): Promise<ScenarioResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const keyword = scenarioKeyword(input.location);

  const fail = (error: ScenarioError): never => {
    throw error;
  };

  if (keyword.includes("unknown") || keyword.includes("xyz")) {
    fail({
      code: "location-not-found",
      title: "Location not found",
      message: "We couldn't identify this location. Please enter a valid Singapore location.",
    });
  }

  if (
    keyword.includes("london") ||
    keyword.includes("tokyo") ||
    keyword.includes("paris") ||
    keyword.includes("new york")
  ) {
    fail({
      code: "location-outside-singapore",
      title: "Unsupported location",
      message: "This prototype currently supports locations within Singapore.",
    });
  }

  if (keyword.includes("none")) {
    fail({
      code: "no-qualifying-aed",
      title: "No qualifying AED found",
      message: "No suitable candidate could be confidently identified for this simulated scenario.",
    });
  }

  if (keyword.includes("fail") || keyword.includes("error")) {
    fail({
      code: "service-unavailable",
      title: "Unable to process scenario",
      message: "The analysis service is temporarily unavailable. Please try again.",
    });
  }

  const result = buildResult(input);

  if (keyword.includes("far")) {
    result.recommendation!.distanceMeters = 2340;
    result.recommendation!.factors.distance = 32;
    result.recommendation!.overallScore = 68;
    result.baseline!.decisionSupport.scoreLabel = "Score: 68%";
    result.warnings.push("long-distance");
  }

  if (keyword.includes("closed")) {
    result.recommendation = null;
    result.route = null;
    result.baseline = null;
    result.candidates = result.candidates.map((candidate) => ({
      ...candidate,
      operatingHours: "no-match",
    }));
    result.warnings.push("all-candidates-closed");
  }

  if (keyword.includes("route")) {
    result.route = null;
    result.warnings.push("route-unavailable");
  }

  if (keyword.includes("low")) {
    result.recommendation!.factors.locationConfidence = 41;
    result.warnings.push("low-confidence");
  }

  if (result.candidates.some((candidate) => candidate.operatingHours === "uncertain")) {
    result.warnings.push("ambiguous-hours");
  }

  result.explanationFacts = buildExplanation(result);

  return result;
}

/** Composed from result data, never hardcoded per scenario. */
export function buildExplanation(result: ScenarioResult): string[] {
  const recommendation = result.recommendation;
  if (!recommendation) {
    return [
      "No candidate met the qualifying threshold for this simulated scenario, so no recommendation is shown.",
    ];
  }

  const lines: string[] = [];
  const hoursPhrase =
    recommendation.operatingHours === "match"
      ? `its historical operating-hours information matches the selected simulation time (${result.input.time})`
      : "its historical operating-hours information could not be confirmed for the selected simulation time";

  lines.push(
    `${recommendation.name} ranks highest because ${hoursPhrase} while providing the strongest overall qualifying score of ${recommendation.overallScore}%.`,
  );

  lines.push(
    `It sits about ${recommendation.distanceMeters} m from the simulated location, with a location-confidence factor of ${recommendation.factors.locationConfidence}% in the historical dataset.`,
  );

  if (result.baseline) {
    lines.push(
      `A simple nearest-distance baseline would instead pick ${result.baseline.distanceBaseline.label} (${result.baseline.distanceBaseline.distanceLabel.toLowerCase()}), which scores lower once operating hours and accessibility are considered.`,
    );
  }

  return lines;
}
