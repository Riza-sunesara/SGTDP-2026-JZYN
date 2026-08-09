import {
  MapPin,
  ChartNoAxesColumnIncreasing,
  Trophy,
  ClipboardList,
} from "lucide-react";

const STEPS = [
  {
    step: "STEP 1",
    title: "Enter a Scenario",
    body: "Enter a Location, Day of the week and Simulated time for beginning the process.",
    icon: MapPin,
  },
  {
    step: "STEP 2",
    title: "Analyze AEDs",
    body: "The system evaluates candidate AED locations with historical accessibility information.",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    step: "STEP 3",
    title: "Rank Candidates",
    body: "Candidates are ranked using distance, operating-hour match, accessibility information, and location confidence.",
    icon: Trophy,
  },
  {
    step: "STEP 4",
    title: "Understand the Result",
    body: "View the recommended AED, route visualization, score breakdown, and comparison with nearby options.",
    icon: ClipboardList,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-32 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-semibold text-heading sm:text-3xl">
          How It Works
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {STEPS.map((item, index) => (
            <div key={item.step} className="relative lg:h-[230px]">
              <article
                className="h-full rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {item.step}
                  </p>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon
                      className="h-5 w-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <h3 className="mt-3 text-base font-semibold text-heading">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {item.body}
                </p>
              </article>

              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 top-1/2 z-10 hidden -translate-y-1/2 lg:flex"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary"
                  >
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}