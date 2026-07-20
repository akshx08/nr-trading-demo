import type { Metadata, Viewport } from "next";
import { Anton, Jost, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const jost = Jost({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-jost" });
const inter = Inter({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "N.R. Trading Co. — Steel Keeps Its Word",
  description:
    "Flat steel bought straight off India's biggest mills, cut to your drawing, delivered with the papers ahead of the truck. HR, CR, GP, GL, PPGI, PPGL — since 2005.",
};

export const viewport: Viewport = {
  themeColor: "#0B0C0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${jost.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
