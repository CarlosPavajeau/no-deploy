import { createFileRoute } from "@tanstack/react-router";

import { BentoGrid } from "@/components/landing/bento-grid";
import { HeroSection } from "@/components/landing/hero-section";
import { SiteFooter } from "@/components/landing/site-footer";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="bg-[#0a0a0a]">
      <HeroSection />
      <BentoGrid />
      <SiteFooter />
    </div>
  );
}
