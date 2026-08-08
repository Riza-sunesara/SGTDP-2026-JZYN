const STEPS = [
  {
    step: "Step 1",
    title: "Enter a Scenario",
    body: "Enter a location and simulated time.",
  },
  {
    step: "Step 2",
    title: "Analyze AEDs",
    body: "The system evaluates candidate AED locations and historical accessibility information.",
  },
  {
    step: "Step 3",
    title: "Rank Candidates",
    body: "Candidates are ranked using distance, operating-hours match, accessibility information, and location confidence.",
  },
  {
    step: "Step 4",
    title: "Understand the Result",
    body: "View the recommended AED, route visualization, score breakdown, and comparison with a simple nearest-distance baseline.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-32 py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-semibold text-heading sm:text-3xl">
          How It Works
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <article
              key={item.step}
              className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.step}
              </p>
              <h3 className="mt-2 text-base font-semibold text-heading">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
