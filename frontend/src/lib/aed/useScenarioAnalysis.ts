import { useCallback, useRef, useState } from "react";
import { analyzeScenario } from "./mockService";
import {
  isScenarioError,
  type ScenarioError,
  type ScenarioInput,
  type ScenarioResult,
} from "./types";

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export function useScenarioAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [error, setError] = useState<ScenarioError | null>(null);
  const inFlight = useRef(false);
  const lastInput = useRef<ScenarioInput | null>(null);

  const run = useCallback(async (input: ScenarioInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    lastInput.current = input;
    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const data = await analyzeScenario(input);
      setResult(data);
      setStatus("success");
    } catch (caught) {
      setError(
        isScenarioError(caught)
          ? caught
          : {
              code: "service-unavailable",
              title: "Unable to process scenario",
              message: "The analysis service is temporarily unavailable. Please try again.",
            },
      );
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }, []);

  const retry = useCallback(() => {
    if (lastInput.current) void run(lastInput.current);
  }, [run]);

  const dismissError = useCallback(() => {
    setError(null);
    setStatus((current) => (current === "error" ? "idle" : current));
  }, []);

  const reset = useCallback(() => {
    lastInput.current = null;
    setResult(null);
    setError(null);
    setStatus("idle");
  }, []);

  return { status, result, error, run, retry, reset, dismissError };
}
