# Safety Banner — copy-paste ready

This exact text (from the official brief) MUST appear on every user-facing
screen, clearly visible without scrolling. Do not paraphrase it.

---

Prototype for planning and simulation only—not for emergency use. In an
emergency in Singapore, call 995 immediately and follow SCDF instructions.
Use official SCDF/myResponder channels. Do not delay emergency action to
use this prototype.

---

## Where to put it (frontend)
- Pin it as a persistent banner/strip at the top of every page (search page,
  results page, any admin/registry view if you build one)
- Use a distinct but non-alarming color (e.g., muted amber/yellow background,
  dark text) — not emergency red, since this tool is explicitly NOT an
  emergency service
- Keep font size readable; don't let it be dismissible/hideable

## Lovable prompt snippet you can reuse
"Add a persistent, non-dismissible banner at the top of every page with a
muted amber background (#FEF3C7) and dark slate text (#78350F), containing
this exact text: [paste text above]. It should never scroll out of view on
the first load."
