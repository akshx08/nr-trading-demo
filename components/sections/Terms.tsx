"use client";

import { motion } from "motion/react";
import { TERMS, CONTACT } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Terms() {
  return (
    <section id="terms" className="relative bg-soot border-t border-line2" style={{ scrollMarginTop: "64px" }}>
      <div className="mx-auto max-w-[1500px] px-5 md:px-12 py-[clamp(90px,11vw,160px)]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.95, ease: EASE }}
          className="mb-14"
        >
          <p className="tag mb-5">STANDING ORDERS — <b>HOW EVERY DEAL RUNS</b></p>
          <h2 className="display text-[clamp(2.6rem,6vw,5.4rem)] max-w-[14ch]">
            Four promises, notarised by habit.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-line2 border border-line2">
          {TERMS.map((t, i) => (
            <motion.div
              key={t.no}
              className="bg-soot p-8 md:p-11 flex gap-6"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: EASE, delay: (i % 2) * 0.12 }}
            >
              <span className="font-label font-semibold text-[12px] tracking-[0.2em] pt-1.5" style={{ color: "rgb(var(--accent-hi))" }}>
                {t.no}
              </span>
              <div>
                <h3 className="font-body font-semibold text-[1.15rem] mb-2">{t.head}</h3>
                <p className="text-[13.5px] text-ash">{t.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-4">
          <span className="tag">{CONTACT.hours}</span>
          <span className="tag">{CONTACT.phone}</span>
        </div>
      </div>
    </section>
  );
}
