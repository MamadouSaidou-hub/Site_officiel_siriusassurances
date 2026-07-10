import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Personnes from "@/components/Personnes";
import Dommages from "@/components/Dommages";
import Specialisees from "@/components/Specialisees";
import ADN from "@/components/ADN";
import Accompagnement from "@/components/Accompagnement";
import WhyUs from "@/components/WhyUs";
import News from "@/components/News";
import Partners from "@/components/Partners";
import Cta from "@/components/Cta";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

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
      <Accompagnement />
      <WhyUs />
      <News />
      <Partners />
      <Cta />
      <Contact />
      <Footer />
      <Chatbot />
    </main>
  );
}
