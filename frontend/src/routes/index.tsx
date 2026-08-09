import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SafetyBanner } from "@/components/aed/SafetyBanner";
import { Navbar } from "@/components/aed/Navbar";
import { Hero } from "@/components/aed/Hero";
import { HowItWorks } from "@/components/aed/HowItWorks";
import { ScenarioForm } from "@/components/aed/ScenarioForm";
import { ResultsSection } from "@/components/aed/ResultsSection";
import { AlertModal } from "@/components/aed/AlertModal";
import { Footer } from "@/components/aed/Footer";
import { useScenarioAnalysis } from "@/lib/aed/useScenarioAnalysis";

const TITLE = "AED InsightSimulation — Based AED Decision Support";
const DESCRIPTION =
  "AED Insight ranks candidate AED locations using historical accessibility, operating-hours data, distance and location confidence for planning and preparedness simulations.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

export default Index;

function Index() {
  const [location, setLocation] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [time, setTime] = useState("");
  const { status, result, error, run, retry, reset, dismissError } = useScenarioAnalysis();

  const handleReset = () => {
    setLocation("");
    setDayOfWeek("");
    setTime("");
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <SafetyBanner />
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />

        <section id="try-now" className="scroll-mt-24 bg-muted py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold text-heading sm:text-3xl">
              Try It Now
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-foreground">
              Enter a simulated location, day, and time to see how available AEDs are ranked.
            </p>

            <div className="mt-8">
              <ScenarioForm
                loading={status === "loading"}
                onSubmit={run}
                onReset={handleReset}
                location={location}
                dayOfWeek={dayOfWeek}
                time={time}
                setLocation={setLocation}
                setDayOfWeek={setDayOfWeek}
                setTime={setTime}
              />
            </div>

            <div aria-live="polite" className="mt-6">
              {status === "loading" && (
                <p className="text-center text-sm font-medium text-primary">
                  Analyzing Scenario...
                </p>
              )}
              {status === "success" && result && <ResultsSection result={result} />}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AlertModal
        open={Boolean(error)}
        title={error?.title ?? ""}
        message={error?.message ?? ""}
        onClose={dismissError}
        {...(error?.code === "service-unavailable"
          ? {
              onRetry: () => {
                dismissError();
                retry();
              },
              onReset: () => {
                dismissError();
                handleReset();
              },
            }
          : {})}
      />
    </div>
  );
}