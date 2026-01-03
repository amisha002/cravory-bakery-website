import { unstable_noStore as noStore } from "next/cache"
import { supabaseServer } from "@/lib/supabase-server"
import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface Props {
    params: { id: string }
}

/* ================= METADATA ================= */

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
            description: "Check out our delicious cakes!",
        }
    }

    return {
        metadataBase: new URL(DOMAIN),
        title: image.caption,
        description: image.category,
        openGraph: {
            title: image.caption,
            description: image.category,
            url: `${DOMAIN}/gallery/${id}`,
            images: [{ url: image.image_url }],
            siteName: "Cravory Bakery",
        },
        twitter: {
            card: "summary_large_image",
            title: image.caption,
            description: image.category,
            images: [image.image_url],
        },
    }
}

/* ================= PAGE ================= */

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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-10">
                <Link href="/gallery">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Gallery
                    </Button>
                </Link>

                <div className="mt-6">
                    <img
                        src={image.image_url}
                        alt={image.caption}
                        className="w-full max-h-[80vh] object-contain"
                    />
                    <h1 className="mt-4 text-2xl font-bold">{image.caption}</h1>
                    <p className="text-muted-foreground">{image.category}</p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
