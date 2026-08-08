import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import type { ScenarioInput } from "@/lib/aed/types";

type Props = {
  loading: boolean;
  onSubmit: (input: ScenarioInput) => void;
  onReset: () => void;
  location: string;
  time: string;
  setLocation: (value: string) => void;
  setTime: (value: string) => void;
};

export function ScenarioForm({
  loading,
  onSubmit,
  onReset,
  location,
  time,
  setLocation,
  setTime,
}: Props) {
  const [errors, setErrors] = useState<{
    location?: string | undefined;
    time?: string | undefined;
  }>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    const next: { location?: string; time?: string } = {};
    if (!location.trim()) next.location = "Please enter a location.";
    if (!time) next.time = "Please select a time.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({ location: location.trim(), time });
  };

  const handleReset = () => {
    setErrors({});
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="location" className="block text-sm font-medium text-heading">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (errors.location) setErrors((p) => ({ ...p, location: undefined }));
            }}
            placeholder="Enter a Singapore location"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
            className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-heading placeholder:text-foreground/60 focus:border-primary focus:outline-none"
          />
          {errors.location && (
            <p
              id="location-error"
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden />
              {errors.location}
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label htmlFor="time" className="block text-sm font-medium text-heading">
            Simulated time
          </label>
          <input
            id="time"
            name="time"
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (errors.time) setErrors((p) => ({ ...p, time: undefined }));
            }}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? "time-error" : undefined}
            className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-heading focus:border-primary focus:outline-none"
          />
          {errors.time && (
            <p
              id="time-error"
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden />
              {errors.time}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-accent"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {loading ? "Analyzing Scenario..." : "Find AED"}
        </button>
      </div>
    </form>
  );
}
