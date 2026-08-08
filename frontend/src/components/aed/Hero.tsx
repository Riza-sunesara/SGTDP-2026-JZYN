import { HeroIllustration } from "./HeroIllustration";
import { scrollToSection } from "./Navbar";

export function Hero() {
  return (
    <section id="home" className="scroll-mt-32 bg-muted">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="min-w-0">
          <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
            Simulation-Based Decision Support
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-tight text-heading sm:text-4xl lg:text-5xl">
            Find the Right AED for Every Simulated Scenario
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground">
            AED Insight ranks candidate AED locations using historical accessibility information,
            operating-hours data, distance, and location confidence to support planning and
            preparedness.
          </p>
          <button
            onClick={() => scrollToSection("try-now")}
            className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try It Now
          </button>
        </div>

        <div className="min-w-0 pb-8 lg:pb-0">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
