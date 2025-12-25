import Link from "next/link"
import { Instagram, MessageCircle, Phone } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/logo.png"
              alt="CRAVORY - crafting sweet cravings"
              width={80}
              height={80}
              className="h-20 w-20 rounded-full mb-4 hover:scale-110 transition-transform duration-300"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Eggless desserts made with love for every sweet occasion.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Order</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/custom-order" className="text-muted-foreground hover:text-primary transition-colors">
                  Customized Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-muted-foreground hover:text-primary transition-colors">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-3 mb-4">
              <a
                href="tel:8420174756"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors hover:scale-105 transform"
              >
                <Phone className="h-4 w-4" />
                <span>8420 174 756</span>
              </a>
            </div>
            <div className="flex gap-4">
              <a
                href="https://wa.me/918420174756"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-all hover:scale-125"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/dessert_para_dise"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-all hover:scale-125"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center space-y-2">
          <p className="text-sm text-muted-foreground italic">Baked with love by Aishwarya ❤️</p>
          <p className="text-sm text-muted-foreground">© 2025 CRAVORY. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Delivery available within 5 km near Rishra. Delivery charges vary according to distance.</p>
          <p className="text-xs text-muted-foreground">Designed & Developed by Amisha</p>
        </div>
      </div>
    </footer>
  )
}
