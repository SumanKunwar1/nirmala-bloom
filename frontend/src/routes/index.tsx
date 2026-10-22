import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/home/HeroSection";
import { MissionVision } from "@/components/home/MissionVision";
import { RightsBand } from "@/components/home/RightsBand";
import { FounderSpotlight } from "@/components/home/FounderSpotlight";
import { ImpactCounters } from "@/components/home/ImpactCounters";
import { ProgramsGrid } from "@/components/home/ProgramsGrid";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { NewsPreview } from "@/components/home/NewsPreview";
import { DonateCtaSection } from "@/components/home/DonateCtaSection";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { NewsletterStrip } from "@/components/home/NewsletterStrip";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <>
      <HeroSection />
      <MissionVision />
      <ProgramsGrid />
      <ImpactCounters />
      <RightsBand />
      <FounderSpotlight />
      <TestimonialsCarousel />
      <NewsPreview />
      <NewsletterStrip />
      <PartnersMarquee />
      <DonateCtaSection />
    </>
  );
}
