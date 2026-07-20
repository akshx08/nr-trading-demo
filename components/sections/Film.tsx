"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ACT_VH, RAL_SHADES } from "@/lib/site";
import { store } from "@/lib/store";

const EASE = [0.22, 1, 0.36, 1] as const;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15%" },
  transition: { duration: 0.95, ease: EASE, delay },
});

function Act({ i, children, className = "" }: { i: number; children: React.ReactNode; className?: string }) {
  return (
    <section style={{ height: `${ACT_VH[i]}vh` }} className="relative">
      <div className={`sticky top-0 h-screen overflow-hidden ${className}`}>{children}</div>
    </section>
  );
}

function Station({ n, name }: { n: string; name: string }) {
  return (
    <p className="tag mb-5">
      STATION {n} — <b>{name}</b>
    </p>
  );
}

/* ---------------- interactive: slitter ---------------- */
function SlitPanel() {
  const [n, setN] = useState(5);
  const w = (1250 / n).toFixed(1);
  return (
    <div className="pointer-events-auto w-[300px] md:w-[340px] border border-line2 bg-night/80 p-6">
      <p className="tag mb-4">STRIPS ON THE ARBOR</p>
      <input
        type="range"
        min={2}
        max={8}
        step={1}
        value={n}
        aria-label="Number of slit strips"
        className="arbor"
        onChange={(e) => {
          const v = Number(e.target.value);
          setN(v);
          store.setSlit(v);
        }}
      />
      <div className="mt-4 flex items-baseline justify-between font-label">
        <span className="text-[12px] tracking-[0.14em] text-ash">1,250 ÷ {n}</span>
        <span className="text-[15px] font-semibold tracking-[0.1em]" style={{ color: "rgb(var(--accent-hi))" }}>
          {w} mm
        </span>
      </div>
      <p className="mt-3 text-[11.5px] leading-relaxed text-mute font-label tracking-[0.06em]">
        Kerf compensated · nothing below 25 mm · rewound to 508 / 610 ID
      </p>
    </div>
  );
}

/* ---------------- interactive: coating head ---------------- */
function CoatPanel() {
  const [active, setActive] = useState(0);
  return (
    <div className="pointer-events-auto flex items-center gap-4">
      {RAL_SHADES.map((r, i) => (
        <button
          key={r.code}
          onClick={() => {
            setActive(i);
            store.setRal(r);
          }}
          aria-label={`${r.code} ${r.name}`}
          aria-pressed={active === i}
          className="group flex flex-col items-center gap-2.5"
        >
          <span
            className="block w-11 h-11 md:w-14 md:h-14 border transition-transform duration-300 ease-house group-hover:-translate-y-1"
            style={{
              background: `rgb(${r.css})`,
              borderColor: active === i ? "#EDEFF3" : "rgba(214,219,228,0.25)",
              boxShadow: active === i ? `0 0 34px rgb(${r.css} / .55)` : "none",
            }}
          />
          <span className={`tag transition-colors ${active === i ? "!text-bone" : ""}`}>{r.code.replace("RAL ", "")}</span>
        </button>
      ))}
    </div>
  );
}

/* ================= THE FILM ================= */
export default function Film() {
  return (
    <div id="film" className="relative">
      {/* ACT 1 — arrival */}
      <Act i={0}>
        <div className="h-full mx-auto max-w-[1500px] px-5 md:px-12 flex flex-col justify-center">
          <motion.p {...fade(0)} className="tag mb-7">
            IRON &amp; STEEL TRADERS · EST 2005 · <b>EVERY STATE, EVERY GAUGE</b>
          </motion.p>
          <motion.h1 {...fade(0.08)} className="display text-[clamp(3.6rem,10.5vw,10rem)] max-w-[9ch]">
            Steel keeps <span style={{ color: "rgb(var(--accent-hi))" }}>its word.</span>
          </motion.h1>
          <motion.p {...fade(0.18)} className="mt-8 max-w-[460px] text-ash">
            We buy coil straight off India&rsquo;s six biggest mills, cut it to your drawing, and put it on a truck
            with the papers already in your inbox. Twenty-one years. No excuses filed.
          </motion.p>
          <motion.div {...fade(0.28)} className="mt-10 flex flex-wrap gap-4 pointer-events-auto">
            <a className="btn btn--solid" href="#rfq">Talk tonnage</a>
            <a className="btn" href="#stock">Read the stock book</a>
          </motion.div>
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="tag">SCROLL — THE LINE STARTS</span>
          <span className="block w-px h-10" style={{ background: `linear-gradient(rgb(var(--accent-hi)), transparent)` }} />
        </div>
      </Act>

      {/* ACT 2 — decoiler */}
      <Act i={1}>
        <div className="h-full mx-auto max-w-[1500px] px-5 md:px-12 flex items-end pb-[16vh]">
          <div className="max-w-[520px]">
            <Station n="02" name="DECOILER" />
            <p className="display text-[clamp(2rem,4.2vw,3.5rem)] text-bone">
              A coil is a promise wound sixty layers tight.
            </p>
            <p className="mt-4 text-ash max-w-[400px]">We unwind it exactly once — at your spec, not near it.</p>
          </div>
        </div>
      </Act>

      {/* ACT 3 — anatomy */}
      <Act i={2}>
        <div className="h-full mx-auto max-w-[1500px] px-5 md:px-12 pt-[13vh]">
          <Station n="03" name="SECTION" />
          <h2 className="display text-[clamp(2.4rem,5.4vw,4.6rem)] max-w-[12ch]">
            One millimetre, seven verdicts.
          </h2>
          <p className="mt-5 max-w-[430px] text-ash">
            Coated steel isn&rsquo;t a sheet — it&rsquo;s a stack. Every layer here is certified back to the furnace
            that poured it.
          </p>
        </div>
      </Act>

      {/* ACT 4 — slitter */}
      <Act i={3}>
        <div className="h-full mx-auto max-w-[1500px] px-5 md:px-12 flex flex-col md:flex-row md:items-end justify-end md:justify-between gap-10 pb-[12vh]">
          <div className="max-w-[460px]">
            <Station n="04" name="SLITTER" />
            <h2 className="display text-[clamp(2.4rem,5.4vw,4.6rem)]">Cut where you point.</h2>
            <p className="mt-5 text-ash">
              A 1,250 master becomes two strips or eight. Move the arbor — the knives follow.
            </p>
          </div>
          <SlitPanel />
        </div>
      </Act>

      {/* ACT 5 — coating head */}
      <Act i={4}>
        <div className="h-full mx-auto max-w-[1500px] px-5 md:px-12 flex flex-col justify-end pb-[7vh] gap-6">
          <div className="max-w-[520px]">
            <Station n="05" name="COATING HEAD" />
            <h2 className="display text-[clamp(2.1rem,4.6vw,3.9rem)]">
              Pick a shade. <span style={{ color: "rgb(var(--accent-hi))" }}>The line obeys.</span>
            </h2>
            <p className="mt-4 text-ash max-w-[440px]">
              Colour-coated means baked on at the mill, not brushed on later. Choose — the steel and this page
              repaint together.
            </p>
          </div>
          <CoatPanel />
        </div>
      </Act>

      {/* ACT 6 — dispatch */}
      <Act i={5}>
        <div className="h-full mx-auto max-w-[1500px] px-5 md:px-12 flex items-end pb-[13vh]">
          <div className="max-w-[520px]">
            <Station n="06" name="DISPATCH" />
            <h2 className="display text-[clamp(2.4rem,5.4vw,4.6rem)]">One yard, every state.</h2>
            <p className="mt-5 text-ash max-w-[430px]">
              Full truck or part load, up to six-metre lengths — and the paperwork always travels faster than the
              wheels.
            </p>
          </div>
        </div>
      </Act>
    </div>
  );
}
