import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
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
      <FeaturedProducts />
      <ServicesOverview />
      <WhyChooseUs />
      <TestimonialsPreview />
      <CTABanner />
    </main>
  );
}
