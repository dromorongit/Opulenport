import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import CTABanner from "@/components/home/CTABanner";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryShowcase />
      <ServicesOverview />
      <WhyChooseUs />
      <TestimonialsPreview />
      <CTABanner />
    </main>
  );
}
