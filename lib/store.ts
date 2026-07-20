import { RAL_SHADES, type Ral } from "./site";

/**
 * Tiny module store shared between React UI and the Three.js loop.
 * The scene reads it inside rAF (no re-render); React writes to it.
 */
type Listener = () => void;

const state = {
  slit: 5,
  ral: RAL_SHADES[0] as Ral,
  filmProgress: 0,
};

const listeners = new Set<Listener>();

export const store = {
  get slit() { return state.slit; },
  get ral() { return state.ral; },
  get filmProgress() { return state.filmProgress; },

  setSlit(n: number) {
    state.slit = Math.min(8, Math.max(2, Math.round(n)));
    listeners.forEach((l) => l());
  },

  setRal(r: Ral) {
    state.ral = r;
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--accent", r.css);
      root.style.setProperty("--accent-hi", r.cssHi);
    }
    listeners.forEach((l) => l());
  },

  setFilmProgress(p: number) { state.filmProgress = p; },

  subscribe(l: Listener) {
    listeners.add(l);
    return () => { listeners.delete(l); };
  },
};
