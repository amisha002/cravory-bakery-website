import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { OccasionBar } from "@/components/occasion-bar"
import { CategoryHighlights } from "@/components/category-highlights"
import { WhyCravory } from "@/components/why-cravory"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <OccasionBar />
      <CategoryHighlights />
      <WhyCravory />
      <CtaSection />
      <Footer />
    </div>
  )
}
