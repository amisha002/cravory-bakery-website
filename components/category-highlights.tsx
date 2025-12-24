"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Cake, Cake as Cupcake, Wine, IceCream, Candy } from "lucide-react"

const categories = [
  {
    name: "Cakes",
    description: "Custom eggless cakes in all flavors",
    icon: Cake,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Cupcakes",
    description: "Classic and premium varieties",
    icon: Cupcake,
    color: "bg-secondary/10 text-secondary",
  },
  {
    name: "Jar Cakes",
    description: "Layered desserts in a jar",
    icon: Wine,
    color: "bg-accent/10 text-accent",
  },
  {
    name: "Chocolates",
    description: "Handcrafted & liquor chocolates",
    icon: Candy,
    color: "bg-[#FFB7B2]/10 text-[#FFB7B2]",
  },
  {
    name: "Cakesicles & Popsicles",
    description: "Fun treats on a stick",
    icon: IceCream,
    color: "bg-[#B5EAD7]/10 text-[#B5EAD7]",
  },
]

export function CategoryHighlights() {
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
    <section ref={sectionRef} className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-10 right-20 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse-soft" />
      <div className="absolute bottom-10 left-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse-soft delay-200" />

      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Our Sweet Collection</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our range of delicious eggless desserts, perfect for every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link key={category.name} href="/menu">
              <Card
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full border-2 ${
                  isVisible ? "animate-scale-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div
                    className={`${category.color} p-4 rounded-full group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
