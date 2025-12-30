"use client"

import Link from "next/link"
import { Cake, Gift, Heart } from "lucide-react"

export function OccasionBar() {
    const occasions = [
        {
            label: "Birthday Specials",
            icon: <Cake className="w-4 h-4" />,
            href: "/gallery?category=Birthday Cakes",
            color: "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100",
        },
        {
            label: "Anniversary Cakes",
            icon: <Heart className="w-4 h-4" />,
            href: "/gallery?category=Anniversary Cakes",
            color: "bg-red-50 text-red-700 border-red-100 hover:bg-red-100",
        },
        {
            label: "Quick Treats",
            icon: <Gift className="w-4 h-4" />,
            href: "/gallery?category=Sweet Cravings",
            color: "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
        },
    ]

    return (
        <section className="py-6 border-b border-border/40">
            <div className="container mx-auto px-4">
                {/* Subtle Title */}
                <p className="text-sm text-muted-foreground text-center mb-3 font-medium opacity-80">
                    Shop by Occasion
                </p>

                {/* Horizontal List */}
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 px-2 md:justify-center no-scrollbar items-center snap-x snap-mandatory">
                    {occasions.map((item) => (
                        <Link key={item.label} href={item.href} className="snap-center shrink-0">
                            <div
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border 
                  text-sm font-medium transition-all duration-200
                  hover:scale-105 active:scale-95
                  ${item.color}
                `}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
