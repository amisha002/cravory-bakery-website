"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

const features = [
  {
    title: "100% Eggless",
    description: "All our desserts are completely eggless without compromising on taste",
  },
  {
    title: "Freshly Made",
    description: "Every order is baked fresh to ensure maximum quality and flavor",
  },
  {
    title: "Custom Orders",
    description: "Personalize your cakes and desserts for any special occasion",
  },
  {
    title: "Premium Quality",
    description: "We use only the finest ingredients for exceptional taste",
  },
]

export function WhyCravory() {
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
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5" />
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Why Choose CRAVORY?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're passionate about creating delicious eggless desserts that everyone can enjoy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex gap-4 ${isVisible ? "animate-slide-right" : "opacity-0"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="bg-primary text-primary-foreground rounded-full p-2 hover:scale-110 transition-transform">
                  <Check className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
