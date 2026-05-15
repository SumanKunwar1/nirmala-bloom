import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactCounters } from "@/components/home/ImpactCounters";
import { ProgramsGrid } from "@/components/home/ProgramsGrid";
import { NewsPreview } from "@/components/home/NewsPreview";
import { DonateCtaSection } from "@/components/home/DonateCtaSection";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { NewsletterStrip } from "@/components/home/NewsletterStrip";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <>
      <HeroSection />
      <ImpactCounters />
      <ProgramsGrid />
      <NewsPreview />
      <DonateCtaSection />
      <PartnersMarquee />
      <TestimonialsCarousel />
      <NewsletterStrip />
    </>
  );
}
