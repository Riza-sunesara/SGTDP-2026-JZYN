import { MapPin, HeartPulse, Navigation } from "lucide-react";

/** Product-style visualization. Not a live emergency map. */
export function HeroIllustration() {
  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_30px_-18px_rgba(15,108,189,0.55)]">
        {/* stylised map surface */}
        <div className="relative h-[300px] w-full bg-muted sm:h-[360px]">
          <svg viewBox="0 0 400 360" className="absolute inset-0 h-full w-full" aria-hidden>
            <g stroke="#d3ecee" strokeWidth="10" fill="none">
              <path d="M-10 90 H410" />
              <path d="M-10 200 H410" />
              <path d="M-10 300 H410" />
              <path d="M70 -10 V370" />
              <path d="M200 -10 V370" />
              <path d="M320 -10 V370" />
            </g>
            <g fill="#e2f4f4">
              <rect x="88" y="106" width="96" height="76" rx="6" />
              <rect x="216" y="106" width="88" height="76" rx="6" />
              <rect x="88" y="216" width="96" height="68" rx="6" />
              <rect x="216" y="216" width="88" height="68" rx="6" />
            </g>
            <path
              d="M120 250 C 160 250, 170 200, 210 190 S 250 150, 268 142"
              stroke="#0b6470"
              strokeWidth="4"
              strokeDasharray="9 7"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* simulated location */}
          <div className="absolute left-[26%] top-[66%] -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-primary shadow">
              <Navigation className="size-4 text-primary-foreground" aria-hidden />
            </span>
            <span className="mt-1 block text-[10px] font-medium text-foreground">
              Test location
            </span>
          </div>

          {/* candidate markers */}
          {[
            { left: "58%", top: "78%" },
            { left: "78%", top: "30%" },
          ].map((pos) => (
            <span
              key={pos.left}
              style={pos}
              className="absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm"
            >
              <HeartPulse className="size-4" aria-hidden />
            </span>
          ))}

          {/* highlighted rank #1 */}
          <div className="absolute left-[67%] top-[39%] -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-white bg-success shadow-lg">
              <MapPin className="size-5 text-white" aria-hidden />
            </span>
            <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-heading shadow-sm">
              Rank #1
            </span>
          </div>
        </div>
      </div>

      {/* floating score card */}
      <div className="absolute -bottom-6 left-4 w-56 rounded-xl border border-border bg-card p-3 shadow-lg sm:left-auto sm:right-[-12px]">
        <p className="text-[11px] font-medium uppercase tracking-wide text-foreground">
          Recommendation score
        </p>
        <p className="mt-0.5 text-2xl font-semibold text-heading">91%</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-divider">
          <div className="h-full rounded-full bg-primary" style={{ width: "91%" }} />
        </div>
        <p className="mt-2 text-[11px] text-foreground">Simulated scenario output</p>
      </div>
    </div>
  );
}
