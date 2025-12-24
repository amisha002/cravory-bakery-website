"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram, Sparkles } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 relative overflow-hidden"
    >
      <div className="absolute top-10 left-10 animate-pulse-soft">
        <Sparkles className="h-8 w-8 text-primary/30" />
      </div>
      <div className="absolute top-20 right-20 animate-pulse-soft delay-200">
        <Sparkles className="h-6 w-6 text-accent/30" />
      </div>
      <div className="absolute bottom-10 left-1/4 animate-pulse-soft delay-300">
        <Sparkles className="h-7 w-7 text-secondary/30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-3xl mx-auto text-center ${isVisible ? "animate-scale-in" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Satisfy Your Cravings?</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Order your favorite eggless desserts today via WhatsApp or follow us on Instagram for daily sweet
            inspiration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://wa.me/918420174756?text=Hi!%20I'd%20like%20to%20place%20an%20order%20from%20CRAVORY"
              target="_blank"
            >
              <Button size="lg" className="rounded-full gap-2 hover:scale-105 transition-transform">
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </Button>
            </Link>
            <Link href="https://www.instagram.com/dessert_para_dise" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full gap-2 bg-transparent hover:scale-105 transition-transform"
              >
                <Instagram className="h-5 w-5" />
                Follow on Instagram
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
