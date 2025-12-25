"use client"

import { usePathname } from "next/navigation"
import { DecorativeBackground } from "@/components/decorative-background"

export default function BackgroundWrapper() {
  const pathname = usePathname()

  // ✅ Only show background on these pages
  const showBackground =
    pathname.startsWith("/gallery") ||
    pathname.startsWith("/reviews")

  if (!showBackground) return null

  return <DecorativeBackground />
}
