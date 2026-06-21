import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Personnes from "@/components/Personnes";
import Dommages from "@/components/Dommages";
import Specialisees from "@/components/Specialisees";
import ADN from "@/components/ADN";
import Missions from "@/components/Missions";
import WhyUs from "@/components/WhyUs";
import News from "@/components/News";
import Partners from "@/components/Partners";
import Cta from "@/components/Cta";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="bg-sirius-bg min-h-screen">
      <Header />
      <Hero />
      <About />
      <Personnes />
      <Dommages />
      <Specialisees />
      <ADN />
      <Missions />
      <WhyUs />
      <News />
      <Partners />
      <Cta />
      <Contact />
      <Footer />
    </main>
  );
}
