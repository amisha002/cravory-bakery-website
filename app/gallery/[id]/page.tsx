import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { supabaseServer } from "@/lib/supabase-server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/* ================= CONFIG ================= */

export const dynamic = "force-dynamic"

interface Props {
    params: { id: string }
}

const DOMAIN = "https://cravory-bakery.vercel.app"

/* ================= METADATA (PREVIEW FIX) ================= */

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {

    const { data } = await supabaseServer
        .from("gallery_images")
        .select("image_url, caption, category")
        .eq("id", params.id)
        .single()

    if (!data) {
        return {
            title: "Cravory Cake",
            description: "Eggless cakes by Cravory",
        }
    }

    return {
        metadataBase: new URL(DOMAIN),
        title: data.caption,
        description: data.category,
        openGraph: {
            title: data.caption,
            description: data.category,
            url: `${DOMAIN}/gallery/${params.id}`,
            type: "website",
            siteName: "Cravory Bakery",
            images: [
                {
                    url: data.image_url, // MUST be PUBLIC supabase URL
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: data.caption,
            description: data.category,
            images: [data.image_url],
        },
    }
}

/* ================= PAGE ================= */

export default async function GalleryDetailPage({ params }: Props) {
    noStore()

    const { data: image } = await supabaseServer
        .from("gallery_images")
        .select("*")
        .eq("id", params.id)
        .single()

    if (!image) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p className="text-lg font-medium">Image not found</p>
                </main>
                <Footer />
            </div>
        )
    }

    const whatsappMessage = `
Hi CRAVORY 👋
I’d like to order this cake 🍰

Category: ${image.category}
Description: ${image.caption}

View cake:
${DOMAIN}/gallery/${image.id}
`.trim()

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
                <Link
                    href="/gallery"
                    className="inline-flex items-center mb-6 text-sm text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Gallery
                </Link>

                <img
                    src={image.image_url}
                    alt={image.caption}
                    className="w-full rounded-xl mb-6"
                />

                <h1 className="text-2xl font-bold mb-2">
                    {image.caption}
                </h1>

                <p className="text-muted-foreground mb-8">
                    {image.category}
                </p>

                <a
                    href={`https://wa.me/918420174756?text=${encodeURIComponent(
                        whatsappMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-12 px-8 text-base font-medium"
                >
                    Order this on WhatsApp
                </a>
            </main>

            <Footer />
        </div>
    )
}
