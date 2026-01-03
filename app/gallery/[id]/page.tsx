import { supabaseServer } from "@/lib/supabase-server"
import { unstable_noStore as noStore } from "next/cache"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface Props {
    params: { id: string }
}

/* ========= METADATA (FOR WHATSAPP PREVIEW) ========= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    noStore()

    const { id } = params
    const DOMAIN = "https://cravory-bakery.vercel.app"

    const { data: image } = await supabaseServer
        .from("gallery_images")
        .select("*")
        .eq("id", id)
        .single()

    if (!image) {
        return {
            title: "Cravory Cake Gallery",
            description: "Eggless cakes by Cravory",
        }
    }

    return {
        title: image.caption || "CRAVORY Cake",
        description: image.category || "Eggless cake",
        openGraph: {
            title: image.caption || "CRAVORY Cake",
            description: image.category || "Eggless cake",
            url: `${DOMAIN}/gallery/${id}`,
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

    const { id } = params

    const { data: image } = await supabaseServer
        .from("gallery_images")
        .select("*")
        .eq("id", id)
        .single()

    if (!image) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    Image not found
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <Link href="/gallery">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
                    </Button>
                </Link>

                <img
                    src={image.image_url}
                    alt={image.caption}
                    className="w-full max-h-[80vh] object-contain mt-6"
                />

                <h1 className="text-2xl font-bold mt-4">{image.caption}</h1>

                <a
                    href={`https://wa.me/918420174756?text=${encodeURIComponent(
                        `Hi CRAVORY 👋\nI’d like to order this cake 🍰\n\n${image.caption}\n\nhttps://cravory-bakery.vercel.app/gallery/${id}`
                    )}`}
                    target="_blank"
                >
                    <Button className="mt-6">Order on WhatsApp</Button>
                </a>
            </main>

            <Footer />
        </div>
    )
}
