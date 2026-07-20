# N.R. Trading Co. — THE LINE

The site is a steel processing line; scroll is the conveyor. One persistent WebGL scene
carries a coil through six stations — decoil, section, slitter, coating head, dispatch —
before the machine yields to paper: stock book, standing orders, and an RFQ that lands
in WhatsApp.

## Signature moves

- **A single unbroken 3D take.** Camera on rails through the whole film, scrubbed by scroll.
- **The seven-layer section.** PPGI anatomy exploded in true 3D with projected annotations.
- **The arbor.** Drag a slider — the slitter re-knifes the master coil live, 2 to 8 strips.
- **The coating head.** Pick a RAL shade and the *entire site* repaints with the steel:
  materials, lighting, and UI accent share one source of truth.
- **Dispatch.** Finished coils swarm from a stock grid into a dot-map of India.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind — with Three.js for the scene,
GSAP ScrollTrigger for scroll scrub, Lenis for inertial scroll, and `motion/react` for
section reveals only. The scroll smoothing runs at lerp 0.09 with DPR capped at 2.

No textures, no models, no asset pipeline: every object in the scene — coil, ribbon,
layer stack, strips, roller, the India swarm — is generated procedurally at runtime.

`prefers-reduced-motion` is honoured (no inertial scroll, no idle motion), and the page
remains fully readable if WebGL is unavailable.

## Facts

Every figure is real: est. 2005 · eight product lines (HR, CR, GP, GL, PPGI, PPGL,
colour coated, processed) · six partner mills · slitting to 25 mm minimum ·
cut-to-length to 6,000 mm · firm quotes inside one working day.

The previous single-file concept remains at `/demo-7.html`.
