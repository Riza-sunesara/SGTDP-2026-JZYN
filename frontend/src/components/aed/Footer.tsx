import { scrollToSection } from "./Navbar";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
  { id: "try-now", label: "Try Now" },
];

export function Footer() {
  return (
    <footer className="bg-footer-bg py-10 text-center text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4">
        <p className="text-lg font-semibold">AED Insight</p>
        <nav
          aria-label="Footer"
          className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm"
        >
          {LINKS.map((link, index) => (
            <span key={link.id} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden className="opacity-60">
                  |
                </span>
              )}
              <button
                onClick={() => scrollToSection(link.id)}
                className="rounded px-1 underline-offset-4 hover:underline"
              >
                {link.label}
              </button>
            </span>
          ))}
        </nav>
        <p className="mx-auto mt-4 max-w-xl text-sm opacity-90">
          This tool is for simulation only, not for emergencies. Call 995 in an emergency.
        </p>
        <p className="mt-3 text-xs opacity-80">© Riza Zulfiqar - SGTDP Hackathon</p>
      </div>
    </footer>
  );
}
