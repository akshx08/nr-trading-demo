# N.R. Trading Co. — "The Instrument"

Concept site for N.R. Trading Co., iron &amp; steel trading, pan India, since 2005.

The premise: present a steel trader as a **precision measuring instrument** rather than a brochure — graphite ground, platinum wireframe line-work, and a single molten-amber accent used only where the meaning is "hot" or "active".

## Stack

A single self-contained `index.html`. **No framework, no build step, no dependencies** — vanilla JavaScript, `<canvas>` and inline `<svg>`. The only external request is Google Fonts.

Deployed on Vercel as a static file; nothing to configure.

## The two scroll acts

Both are scroll-scrubbed via one hand-written `requestAnimationFrame` loop (scroll lerp `0.09`, DPR capped at `2`).

1. **Hero — the coil.** A wireframe steel coil unspools into a flat strip as you scroll, with a live gauge readout riding a dimension line.
2. **[02] The Section.** A PPGI coil cross-section explodes into its seven labeled layers — guard film, top coat, primer, zinc, substrate, zinc, back coat — with leader-line annotations, a constellation web, and a layer counter that scrubs in both directions.

## Interactive pieces

- **Slitting calculator** ([04] Processing) — 1,250 mm master divided into 2–8 strips, 25 mm minimum width.
- **Product index** ([03]) — clicking any row preselects that product in the RFQ form.
- **RFQ form** ([08]) — composes the enquiry and opens it as a pre-filled WhatsApp message. No backend, nothing stored.

## Accessibility &amp; resilience

- `prefers-reduced-motion` fully honoured — static frames, no ambient motion, no custom cursor.
- Works without JavaScript: the cross-section renders in its exploded, fully-labeled state.
- Single `<h1>`, semantic landmarks, visible focus rings.
- Verified in Chromium and WebKit at 1440px and 390px.

## Content

Every figure on the page is real and sourced from the company: est. 2005, eight product lines (HR, CR, GP, GL, PPGI, PPGL, colour coated, processed), six partner mills, cut-to-length to 6,000 mm, slitting from 25 mm, firm quotes within one business day.
