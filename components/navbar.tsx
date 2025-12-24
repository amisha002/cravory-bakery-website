"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingCart, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/reviews", label: "Reviews" },
    { href: "/custom-order", label: "Customized Orders" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="CRAVORY - crafting sweet cravings"
              width={60}
              height={60}
              className="h-14 w-14 rounded-full"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:scale-110 inline-block"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:8420174756" className="hidden md:flex">
              <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform bg-transparent">
                <Phone className="h-4 w-4" />
                <span className="font-semibold">8420174756</span>
              </Button>
            </a>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:scale-110 transition-transform">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4">
              <a href="tel:8420174756" className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                <span>8420174756</span>
              </a>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
