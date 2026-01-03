import { unstable_noStore as noStore } from "next/cache"
import { supabaseServer } from "@/lib/supabase-server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
    params: { id: string }
}

export default async function GalleryDetailPage({ params }: Props) {
    noStore()

    const { data: image, error } = await supabaseServer
        .from("gallery_images")
        .select("*")
        .eq("id", params.id)
        .single()

    if (error || !image) {
        return (
            <>
                <Navbar />
                <div className="py-20 text-center text-lg">Image not found</div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-10">
                <Link href="/gallery" className="inline-flex items-center mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Gallery
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
        </>
    )
}
