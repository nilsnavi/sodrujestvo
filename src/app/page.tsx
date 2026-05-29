import Navbar from "@/components/layout/Navbar";
import AboutBreed from "@/components/sections/AboutBreed";
import AISection from "@/components/sections/AISection";
import CTA from "@/components/sections/CTA";
import Club from "@/components/sections/Club";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Media from "@/components/sections/Media";
import Puppies from "@/components/sections/Puppies";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <AboutBreed />
      <Puppies />
      <Club />
      <Media />
      <AISection />
      <CTA />
      <Footer />
    </main>
  );
}
