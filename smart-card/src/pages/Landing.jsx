import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import WhyTapMilan from "../components/landing/WhyTapMilan";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import ProductShowcase from "../components/landing/ProductShowcase";
import WhoIsItFor from "../components/landing/WhoIsItFor";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] text-[#171717]">
      <Navbar />
      <Hero />
      <WhyTapMilan />
      <Features />
      <HowItWorks />
      <ProductShowcase />
      <WhoIsItFor />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}