import { useState } from "react";
import { Menu, X, HeartPulse } from "lucide-react";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="sticky top-12.5 z-40 border-b border-divider bg-background/95 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6"
      >
        <button onClick={() => go("home")} className="flex min-w-0 items-center gap-2 text-left">
          <HeartPulse className="size-6 shrink-0 text-primary" aria-hidden />
          <span className="truncate text-lg font-semibold text-heading">AED Insight</span>
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => go("try-now")}
            className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Try Now
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md border border-border p-2 text-primary sm:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-divider bg-background px-4 pb-4 pt-2 sm:hidden">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-accent"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => go("try-now")}
            className="mt-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Try Now
          </button>
        </div>
      )}
    </header>
  );
}
