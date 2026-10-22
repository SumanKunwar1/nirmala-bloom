import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "@/components/shared/NewsCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { useContent } from "@/lib/admin/context";

export function NewsPreview() {
  const { stories } = useContent();
  const recent = stories.filter((s) => s.published !== false).slice(0, 3);
  if (recent.length === 0) return null;
  const [lead, ...rest] = recent;

  return (
    <section className="py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          align="left"
          eyebrow="Latest stories"
          title={
            <>
              News from <span className="serif-em">the field.</span>
            </>
          }
          action={
            <Link to="/news" className="btn-pill btn-outline">
              All news <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <ScrollReveal className="lg:col-span-7">
            <NewsCard {...lead} featured />
          </ScrollReveal>
          <div className="lg:col-span-5 grid gap-6 lg:gap-8 content-start">
            {rest.map((p, i) => (
              <ScrollReveal key={p.slug} delay={0.1 * (i + 1)}>
                <NewsCard {...p} compact />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
