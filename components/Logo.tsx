/**
 * The mark: a coil section mid-decoil — one strip, wound tight, leaving the frame.
 * Spiral path is generated, not hand-traced, so it is geometrically true.
 */
function spiralPath(cx: number, cy: number, r0: number, r1: number, turns: number): string {
  const steps = Math.round(turns * 36);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = turns * Math.PI * 2 * t;
    const r = r0 + (r1 - r0) * t;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
  }
  return d;
}

const SPIRAL = spiralPath(22, 24, 2.2, 13, 2);

export function Mark({ className = "", stroke = 2.4 }: { className?: string; stroke?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* wound strip */}
      <path d={SPIRAL} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      {/* the strip leaves the coil — gauge shown as two edges */}
      <path d="M35 22.7 H 46" stroke="rgb(var(--accent-hi))" strokeWidth={stroke * 0.62} strokeLinecap="round" />
      <path d="M35 25.6 H 46" stroke="rgb(var(--accent-hi))" strokeWidth={stroke * 0.62} strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3 text-bone">
      <Mark className="w-8 h-8" />
      {!compact && (
        <span className="leading-none">
          <span className="block font-label font-semibold tracking-[0.08em] text-[17px]">N.R.</span>
          <span className="block font-label text-[8.5px] tracking-[0.34em] text-ash mt-[3px]">TRADING CO</span>
        </span>
      )}
    </span>
  );
}
