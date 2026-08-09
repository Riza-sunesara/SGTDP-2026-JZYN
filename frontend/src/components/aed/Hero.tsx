import { HeroIllustration } from "./HeroIllustration";
import { scrollToSection } from "./Navbar";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="scroll-mt-32 bg-muted">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-11 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="min-w-0">
          <span className="inline-block rounded-full border border-accent bg-accent/40 px-3 py-1 text-xs font-medium text-primary">
            AI Decision Support for Singapore
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-tight text-heading sm:text-4xl lg:text-5xl">
            Find an Available AED When <span className="text-primary"> It Matters Most</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground">
            AED Insight ranks candidate AED locations using historical accessibility information,
            operating-hours data, distance, and location confidence to support planning and
            preparedness.
          </p>
          <button
            onClick={() => scrollToSection("try-now")}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <Search className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Find Available AED
          </button>
        </div>

        <div className="min-w-0 pb-8 lg:pb-0">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
