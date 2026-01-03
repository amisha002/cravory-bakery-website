import { Suspense } from "react"
import GalleryClient from "./gallery-client"

export const dynamic = "force-dynamic"

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <GalleryClient />
    </Suspense>
  )
}
