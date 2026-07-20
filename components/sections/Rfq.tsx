"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CONTACT, PRODUCTS } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const FIELD =
  "w-full bg-transparent border-0 border-b border-line focus:border-b focus:ring-0 outline-none py-2.5 px-0.5 text-[14.5px] text-bone placeholder:text-mute/70 transition-colors";
const LABEL = "tag block mb-2";

export default function Rfq() {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const productRef = useRef<HTMLSelectElement>(null);

  // stock-book rows preselect their product here
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const row = (e.target as HTMLElement).closest?.(".js-line") as HTMLElement | null;
      if (!row || !productRef.current) return;
      const name = row.dataset.product;
      if (!name) return;
      for (const opt of Array.from(productRef.current.options)) {
        if (opt.text === name) { productRef.current.value = opt.value; break; }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const f = formRef.current!;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const v = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value?.trim() ?? "";
    const lines = ["Enquiry — N.R. Trading Co.", ""];
    lines.push(`Name: ${v("name")}`);
    if (v("company")) lines.push(`Company: ${v("company")}`);
    lines.push(`Phone: ${v("phone")}`);
    lines.push(`Product: ${v("product")}`);
    if (v("size")) lines.push(`Size: ${v("size")}`);
    if (v("qty")) lines.push(`Tonnage: ${v("qty")} MT`);
    if (v("notes")) lines.push(`Notes: ${v("notes")}`);
    window.open(`${CONTACT.wa}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    setSent(true);
  };

  return (
    <section id="rfq" className="relative bg-night border-t border-line2" style={{ scrollMarginTop: "64px" }}>
      <div className="mx-auto max-w-[1500px] px-5 md:px-12 py-[clamp(90px,11vw,160px)] grid lg:grid-cols-[0.9fr_1.1fr] gap-[clamp(44px,6vw,100px)]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.95, ease: EASE }}
        >
          <p className="tag mb-5">LAST STATION — <b>YOUR MOVE</b></p>
          <h2 className="display text-[clamp(2.6rem,6vw,5.4rem)]">Talk tonnage.</h2>
          <p className="mt-6 max-w-[420px] text-ash">
            Give us gauge, width, grade and tonnes. The reply is a firm price inside one working day — a number,
            not a call-back.
          </p>
          <div className="mt-9 border-t border-line2">
            {[
              { k: "CALL", v: CONTACT.phone, href: CONTACT.phoneHref },
              { k: "WHATSAPP", v: CONTACT.phone, href: CONTACT.wa },
              { k: "WRITE", v: CONTACT.email, href: `mailto:${CONTACT.email}` },
            ].map((c) => (
              <a
                key={c.k}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener" : undefined}
                className="flex justify-between items-baseline gap-4 py-4 border-b border-line2 font-label text-[13px] tracking-[0.05em] hover:text-accent2 transition-colors"
              >
                <span className="tag">[{c.k}]</span>
                <span>{c.v}</span>
              </a>
            ))}
            <div className="flex justify-between items-baseline gap-4 py-4 border-b border-line2">
              <span className="tag">[DESK]</span>
              <span className="font-label text-[13px] tracking-[0.05em] text-ash">{CONTACT.hours}</span>
            </div>
          </div>
        </motion.div>

        <motion.form
          ref={formRef}
          noValidate
          onSubmit={submit}
          className="relative border border-line2 bg-soot p-7 md:p-11"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.95, ease: EASE, delay: 0.1 }}
        >
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label htmlFor="f-name" className={LABEL}>Name *</label>
              <input id="f-name" name="name" required autoComplete="name" className={FIELD} />
            </div>
            <div>
              <label htmlFor="f-company" className={LABEL}>Company</label>
              <input id="f-company" name="company" autoComplete="organization" className={FIELD} />
            </div>
            <div>
              <label htmlFor="f-phone" className={LABEL}>Phone *</label>
              <input id="f-phone" name="phone" type="tel" required autoComplete="tel" className={FIELD} />
            </div>
            <div>
              <label htmlFor="f-product" className={LABEL}>Product</label>
              <select id="f-product" name="product" ref={productRef} className={`${FIELD} bg-night`}>
                {PRODUCTS.map((p) => (
                  <option key={p.no} value={p.name}>{p.name}</option>
                ))}
                <option>Several — see notes</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-size" className={LABEL}>Size — gauge × width</label>
              <input id="f-size" name="size" placeholder="0.50 × 1250 mm" className={FIELD} />
            </div>
            <div>
              <label htmlFor="f-qty" className={LABEL}>Tonnage (MT)</label>
              <input id="f-qty" name="qty" inputMode="decimal" placeholder="25" className={FIELD} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="f-notes" className={LABEL}>Notes — grade · shade · delivery point</label>
              <textarea id="f-notes" name="notes" rows={3} placeholder="IS 513 CR2, RAL 3020, delivery Ludhiana…" className={`${FIELD} resize-y`} />
            </div>
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-5">
            <button type="submit" className="btn btn--solid">Send the spec →</button>
            <span className="tag">OPENS WHATSAPP · NOTHING IS STORED</span>
          </div>

          {sent && (
            <div className="absolute inset-0 bg-soot flex flex-col items-center justify-center gap-5 text-center p-8">
              <p className="tag">SPEC — <b>ON ITS WAY</b></p>
              <p className="font-body font-semibold text-[1.4rem] max-w-[26ch]">
                WhatsApp has your enquiry. A firm number comes back within one working day.
              </p>
              <button type="button" className="btn" onClick={() => { setSent(false); formRef.current?.reset(); }}>
                New enquiry
              </button>
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
