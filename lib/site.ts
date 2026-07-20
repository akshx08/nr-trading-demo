/* All figures are real: sourced from N.R. Trading Co.'s own material. */

export const CONTACT = {
  phone: "+91 98711 50620",
  phoneHref: "tel:+919871150620",
  wa: "https://wa.me/919871150620",
  email: "sachingrg441@gmail.com",
  hours: "Mon – Sat · 09:30 – 19:00 IST",
};

export type Ral = {
  code: string;
  name: string;
  /** "r g b" triplet for CSS var */
  css: string;
  cssHi: string;
  hex: number;
  hexHi: number;
};

export const RAL_SHADES: Ral[] = [
  { code: "RAL 3020", name: "Traffic Red", css: "196 22 28",  cssHi: "255 92 86",  hex: 0xc4161c, hexHi: 0xff5c56 },
  { code: "RAL 5015", name: "Sky Blue",    css: "34 113 179", cssHi: "96 176 244", hex: 0x2271b3, hexHi: 0x60b0f4 },
  { code: "RAL 6029", name: "Mint Green",  css: "15 113 72",  cssHi: "63 190 132", hex: 0x0f7148, hexHi: 0x3fbe84 },
  { code: "RAL 1023", name: "Traffic Yellow", css: "250 210 1", cssHi: "255 232 110", hex: 0xfad201, hexHi: 0xffe86e },
];

export const LAYERS = [
  { name: "PEEL FILM",    spec: "comes off at your site, not before" },
  { name: "COLOUR COAT",  spec: "RMP · SMP · PVDF — 15–20 µ" },
  { name: "PRIME COAT",   spec: "epoxy bond — 5–7 µ" },
  { name: "ZINC ARMOUR",  spec: "hot-dip — 90–275 g/m²" },
  { name: "THE CORE",     spec: "IS 513 steel — 0.25–1.20 mm" },
  { name: "ZINC ARMOUR",  spec: "underside — same weight" },
  { name: "SERVICE COAT", spec: "mill grey — 5–7 µ" },
];

export const PRODUCTS = [
  { no: "01", name: "HR Coil",            std: "IS 2062",            range: "1.6 – 25.0 mm", use: "Frames, beds, anything that holds weight" },
  { no: "02", name: "CR Coil",            std: "IS 513",             range: "0.30 – 3.00 mm", use: "Skins, panels, parts that face people" },
  { no: "03", name: "GP Sheet & Coil",    std: "IS 277 · Z90–Z275",  range: "0.18 – 3.00 mm", use: "Roofs, ducts, weather work" },
  { no: "04", name: "GL Sheet & Coil",    std: "AZ70 – AZ150",       range: "0.25 – 1.60 mm", use: "Sheds that outlive their loans" },
  { no: "05", name: "PPGI",               std: "RMP · SMP · PVDF",   range: "0.25 – 1.20 mm", use: "Colour on the skyline" },
  { no: "06", name: "PPGL",               std: "Coated galvalume",   range: "0.25 – 1.20 mm", use: "Façades with a warranty" },
  { no: "07", name: "Colour Coated",      std: "Any RAL on order",   range: "Coil · sheet",   use: "Brand-matched cladding" },
  { no: "08", name: "Processed to Size",  std: "CTL · slitting",     range: "To drawing",     use: "Arrives ready for the press" },
];

export const MILLS = [
  { name: "Tata Steel",  note: "HR · CR · GP" },
  { name: "JSW Steel",   note: "Coated · Colour" },
  { name: "SAIL",        note: "HR · Structural" },
  { name: "Jindal Steel",note: "HR · Plate" },
  { name: "AM/NS India", note: "GL · PPGL" },
  { name: "POSCO",       note: "CR · Precision" },
];

export const TERMS = [
  { no: "I",   head: "A price in 24 hours",             body: "A number you can plan around — not a mood, not a call-back." },
  { no: "II",  head: "The mill's own certificate",      body: "Original test certificates ride with every load, traceable to the heat." },
  { no: "III", head: "Papers beat the truck",           body: "Invoice, e-way bill, LR and certificates land before the driver calls." },
  { no: "IV",  head: "Tolerance is measured",           body: "Slitting and cut-to-length checked against the drawing, not against habit." },
];

/** Film act spans in vh — single source of truth for page layout & 3D choreography. */
export const ACT_VH = [140, 130, 175, 150, 150, 165];
export const FILM_VH = ACT_VH.reduce((a, b) => a + b, 0);

/** Cumulative act windows as fractions of film progress. */
export const ACT_WINDOWS: [number, number][] = (() => {
  const out: [number, number][] = [];
  let acc = 0;
  for (const vh of ACT_VH) {
    out.push([acc / FILM_VH, (acc + vh) / FILM_VH]);
    acc += vh;
  }
  return out;
})();
