"use client";

import { motion } from "motion/react";
import { MILLS, PRODUCTS } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Stock() {
  return (
    <section id="stock" className="relative bg-night border-t border-line2" style={{ scrollMarginTop: "64px" }}>
      <div className="mx-auto max-w-[1500px] px-5 md:px-12 py-[clamp(90px,11vw,160px)]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.95, ease: EASE }}
          className="flex flex-wrap items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="tag mb-5">LEDGER — <b>WHAT WE HOLD</b></p>
            <h2 className="display text-[clamp(2.6rem,6vw,5.4rem)]">The stock book.</h2>
          </div>
          <p className="tag pb-2">EIGHT LINES · MILL ALLOCATION + YARD STOCK</p>
        </motion.div>

        <div className="border-t border-line">
          {PRODUCTS.map((p, i) => (
            <motion.a
              key={p.no}
              href="#rfq"
              data-product={p.name}
              className="js-line group grid grid-cols-[44px_1fr_auto] md:grid-cols-[64px_1.3fr_0.9fr_0.9fr_1.2fr_90px] items-baseline gap-4 md:gap-6 py-6 border-b border-line2 hover:bg-iron/40 transition-colors"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.06 }}
            >
              <span className="font-label text-[10.5px] tracking-[0.16em] text-mute">{p.no}</span>
              <span className="font-body font-semibold text-[clamp(1rem,1.5vw,1.3rem)] text-bone">{p.name}</span>
              <span className="hidden md:block font-label text-[11px] tracking-[0.1em] text-ash">{p.std}</span>
              <span className="hidden md:block font-label text-[11px] tracking-[0.1em] text-ash">{p.range}</span>
              <span className="hidden md:block text-[12.5px] text-mute">{p.use}</span>
              <span
                className="justify-self-end font-label text-[10px] tracking-[0.18em] text-mute group-hover:text-bone border border-transparent px-3 py-1.5 transition-colors"
                style={{ borderColor: "transparent" }}
              >
                + RFQ
              </span>
            </motion.a>
          ))}
        </div>

        {/* sources */}
        <div id="mills" className="mt-[clamp(70px,9vw,120px)]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="tag mb-8"
          >
            SOURCES — <b>BOUGHT AT THE FURNACE DOOR</b>
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-line2 border border-line2">
            {MILLS.map((m, i) => (
              <motion.div
                key={m.name}
                className="bg-night px-6 py-7"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.12 }}
              >
                <span className="block font-body font-semibold text-[1.05rem]">{m.name}</span>
                <span className="tag mt-2 block">{m.note}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 max-w-[560px] text-[13px] text-mute">
            Allocation buying means our price starts at the mill list, not the secondary market — and the original
            test certificate never leaves the load.
          </p>
        </div>
      </div>
    </section>
  );
}
