import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float delay-200" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse-soft" />
      </div>

      <div className="absolute top-10 right-10 opacity-20 animate-float">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#ff9aa2" />
          <path
            d="M50 20 C60 20, 70 30, 70 40 C70 50, 60 60, 50 60 C40 60, 30 50, 30 40 C30 30, 40 20, 50 20"
            fill="#ffb7b2"
          />
        </svg>
      </div>

      <div className="absolute bottom-20 left-10 opacity-20 animate-float delay-300">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="40" width="50" height="35" rx="5" fill="#c7ceea" />
          <circle cx="50" cy="30" r="15" fill="#ffb7b2" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-up opacity-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 rounded-full border border-primary/20 hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4 text-primary animate-pulse-soft" />
              <span className="text-sm font-medium text-primary">100% Eggless & Handcrafted</span>
            </div>

            <div className="mb-6 flex justify-center">
              <Image
                src="/logo.png"
                alt="CRAVORY - crafting sweet cravings"
                width={400}
                height={150}
                className="h-24 md:h-32 w-auto hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 text-foreground">CRAVORY</h1>
            <p className="text-2xl md:text-3xl text-primary font-display font-medium mb-4">crafting sweet cravings</p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Indulge in our handcrafted collection of premium eggless desserts. From custom cakes to artisan
              chocolates, every creation is made fresh with the finest ingredients.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in delay-300">
            <Link href="https://wa.me/918420174756" target="_blank">
              <Button size="lg" className="rounded-full gap-2 hover:scale-105 transition-transform">
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full bg-transparent hover:scale-105 transition-transform"
              >
                View Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
