import Nav from "@/components/Nav";
import Scene from "@/components/Scene";
import SmoothScroll from "@/components/SmoothScroll";
import Film from "@/components/sections/Film";
import Stock from "@/components/sections/Stock";
import Terms from "@/components/sections/Terms";
import Rfq from "@/components/sections/Rfq";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <span id="top" />
      <SmoothScroll />
      <Scene />
      <Nav />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <main className="relative z-10">
        <Film />
        <Stock />
        <Terms />
        <Rfq />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
