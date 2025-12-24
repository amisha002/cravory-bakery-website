import type React from "react"
import type { Metadata } from "next"
import { DM_Mono as DM, DM_Sans as Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"

const dmSans = DM({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400"],
})

const fredoka = Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "CRAVORY - Eggless Desserts Made with Love",
  description:
    "Premium eggless cakes, cupcakes, chocolates, and desserts. Fresh, customizable, and made with love. Order on WhatsApp today!",
  keywords: ["eggless desserts", "eggless cakes", "cupcakes", "custom cakes", "bakery"],

  // ✅ FIXED FAVICON (ONLY LOGO.PNG)
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fredoka.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
