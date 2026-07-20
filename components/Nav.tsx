"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "#film", label: "The Line" },
  { href: "#stock", label: "Stock Book" },
  { href: "#terms", label: "Terms" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 border-b transition-colors duration-500 ${
        solid ? "bg-night/95 border-line2" : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-12 h-16 flex items-center justify-between">
        <a href="#top" aria-label="N.R. Trading Co — top of page">
          <Logo />
        </a>
        <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-label uppercase text-[11px] tracking-[0.2em] text-ash hover:text-bone transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#rfq"
          className="font-label uppercase text-[10.5px] font-semibold tracking-[0.18em] px-4 py-2.5 border transition-colors"
          style={{ borderColor: "rgb(var(--accent) / .5)", color: "rgb(var(--accent-hi))" }}
        >
          Talk Tonnage
        </a>
      </div>
    </header>
  );
}
