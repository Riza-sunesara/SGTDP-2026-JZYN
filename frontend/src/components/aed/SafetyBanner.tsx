const MESSAGE =
  "Prototype for planning and simulation only—not for emergency use. In an emergency in Singapore, call 995 immediately and follow SCDF instructions. Use official SCDF/myResponder channels. Do not delay emergency action to use this prototype.";

export function SafetyBanner() {
  return (
    <div
      role="region"
      aria-label="Safety notice"
      className="sticky top-0 z-50 w-full border-b border-black/10 bg-success px-4 py-2"
    >
      <p className="mx-auto max-w-5xl text-center text-[11px] font-medium leading-snug text-white sm:text-xs">
        {MESSAGE}
      </p>
    </div>
  );
}
