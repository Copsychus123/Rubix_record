
import DemoSection from "./components/DemoSection";
import FAQ from "./components/FAQ";
import HeroSection from "./components/sections/HeroSection";
import CTASection from "./components/sections/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-text-primary bg-bg-primary">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Demo Section (Moved up for A/B/C Structure) */}
      <DemoSection />

      {/* CTA Section (Combined with Testimonials content) */}
      <CTASection />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
