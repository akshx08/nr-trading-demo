import Logo, { Mark } from "../Logo";
import { CONTACT } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night border-t border-line2">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 bottom-[-0.16em] font-disp uppercase whitespace-nowrap leading-none"
        style={{
          fontSize: "clamp(10rem,30vw,26rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(214,219,228,0.08)",
        }}
      >
        N.R.
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-12 pt-[clamp(60px,8vw,100px)] pb-10">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr] gap-12 mb-[clamp(70px,10vw,150px)]">
          <div>
            <Logo />
            <p className="mt-6 max-w-[340px] text-[13px] text-mute">
              Flat steel, moved right. HR · CR · GP · GL · PPGI · PPGL — bought at the furnace door, cut to the
              drawing, delivered every state. Since 2005.
            </p>
          </div>
          <div>
            <p className="tag mb-5">THE LINE</p>
            <div className="flex flex-col gap-3">
              {[
                ["#film", "Stations 01–06"],
                ["#stock", "The stock book"],
                ["#terms", "Standing orders"],
                ["#rfq", "Talk tonnage"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="font-label uppercase text-[11px] tracking-[0.18em] text-ash hover:text-accent2 transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="tag mb-5">THE DESK</p>
            <div className="flex flex-col gap-3">
              <a href={CONTACT.phoneHref} className="font-label uppercase text-[11px] tracking-[0.18em] text-ash hover:text-accent2 transition-colors">{CONTACT.phone}</a>
              <a href={CONTACT.wa} target="_blank" rel="noopener" className="font-label uppercase text-[11px] tracking-[0.18em] text-ash hover:text-accent2 transition-colors">WhatsApp</a>
              <a href={`mailto:${CONTACT.email}`} className="font-label text-[11px] tracking-[0.18em] text-ash hover:text-accent2 transition-colors">{CONTACT.email}</a>
              <span className="font-label uppercase text-[11px] tracking-[0.18em] text-mute">{CONTACT.hours}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-6 border-t border-line2">
          <span className="tag inline-flex items-center gap-2.5"><Mark className="w-4 h-4" /> © 2026 N.R. TRADING CO.</span>
          <span className="tag">STEEL KEEPS ITS WORD</span>
        </div>
      </div>
    </footer>
  );
}
