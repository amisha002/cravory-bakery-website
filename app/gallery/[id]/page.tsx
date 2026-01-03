export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { unstable_noStore as noStore } from "next/cache"
import { supabaseServer } from "@/lib/supabase-server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

interface Props {
    params: { id: string }
}

/* ========= METADATA ========= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    noStore()

    const { data: image } = await supabaseServer
        .from("gallery_images")
        .select("image_url, caption, category")
        .eq("id", params.id)
        .maybeSingle()

    if (!image) {
        return {
            title: "Cravory Cake Gallery",
            description: "Eggless cakes by Cravory",
        }
    }

    return {
        title: image.caption ?? "CRAVORY Cake",
        description: image.category ?? "Eggless cake by Cravory",
        openGraph: {
            images: [{ url: image.image_url }],
        },
        twitter: {
            card: "summary_large_image",
            images: [image.image_url],
        },
    }
}

/* ========= PAGE ========= */

export default async function GalleryDetailPage({ params }: Props) {
    noStore()

    const { data: image, error } = await supabaseServer
        .from("gallery_images")
        .select("*")
        .eq("id", params.id)
        .maybeSingle()

    if (error || !image) {
        console.error("Image fetch failed:", error)
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-lg font-medium">Image not found</p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <Link href="/gallery">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery
                    </Button>
                </Link>

                <img
                    src={image.image_url}
                    alt={image.caption}
                    className="w-full rounded-xl mb-6"
                />

                <h1 className="text-2xl font-bold mb-2">{image.caption}</h1>
                <p className="text-muted-foreground mb-6">{image.category}</p>

                <a
                    href={`https://wa.me/918420174756?text=${encodeURIComponent(
                        `Hi CRAVORY 👋
I’d like to order this cake 🍰

Category: ${image.category}
Description: ${image.caption}

View cake:
https://cravory-bakery.vercel.app/gallery/${params.id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-11 px-8"
                >
                    Order this on WhatsApp
                </a>
            </main>

            <Footer />
        </div>
    )
}
