import type { ScenarioError, ScenarioInput, ScenarioResult } from "./types";

const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "http://127.0.0.1:8000";

export async function analyzeScenario(input: ScenarioInput): Promise<ScenarioResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze-scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let errorBody: Partial<ScenarioError> & { suggestions?: string[] } = {};
    try {
      errorBody = (await response.json()) as Partial<ScenarioError> & { suggestions?: string[] };
    } catch {
      // ignore malformed error payloads and fall back to a generic error
    }

    throw {
      code: errorBody.code ?? "service-unavailable",
      title: errorBody.title ?? "Unable to process scenario",
      message:
        errorBody.message ?? "The analysis service is temporarily unavailable. Please try again.",
    } satisfies ScenarioError;
  }

  return (await response.json()) as ScenarioResult;
}
