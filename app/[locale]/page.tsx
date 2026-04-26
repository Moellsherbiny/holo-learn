import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Features from "@/components/landing/features";
import HologramAR from "@/components/landing/CTABanner";
import AboutResearch from "@/components/landing/about";
import Footer from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <HologramAR />
      <AboutResearch />
      <Footer />
    </main>
  );
}