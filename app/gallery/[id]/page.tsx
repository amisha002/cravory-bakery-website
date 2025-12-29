
import { supabaseServer } from "@/lib/supabase-server"
import type { Metadata, ResolvingMetadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Force dynamic rendering since we depend on params
export const dynamic = "force-dynamic"

interface Props {
    params: Promise<{ id: string }>
}

// 1. GENERATE METADATA FOR WHATSAPP PREVIEWS
export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.params
    const id = params.id
    const DOMAIN = "https://cravory-bakery.vercel.app"

    // Fetch image data
    const { data: image } = await supabaseServer
        .from("gallery_images")
        .select("*")
        .eq("id", id)
        .single()

    if (!image) {
        return {
            title: "Cravory Cake Gallery",
            description: "Check out our delicious cakes!",
            openGraph: {
                images: ["/og-default.jpg"], // fallback if you have one
            },
        }
    }

    const title = image.caption || "CRAVORY Cake"
    const description = image.category || "Delicious cake by Cravory"
    const imageUrl = image.image_url
    const pageUrl = `${DOMAIN}/gallery/${id}`

    return {
        metadataBase: new URL(DOMAIN),
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: pageUrl,
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: title,
                },
            ],
            siteName: "Cravory Bakery",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [imageUrl],
        },
    }
}

// 2. PAGE COMPONENT
export default async function GalleryDetailPage(props: Props) {
    const params = await props.params
    const { id } = params

    const { data: image, error } = await supabaseServer
        .from("gallery_images")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !image) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-4">
                        Image not found
                    </h1>
                    <Link href="/gallery">
                        <Button>Back to Gallery</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">

                    {/* BACK BUTTON */}
                    <Link href="/gallery" className="inline-block mb-6">
                        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Gallery
                        </Button>
                    </Link>

                    <div className="bg-card rounded-xl overflow-hidden shadow-lg border">
                        {/* IMAGE */}
                        <div className="relative aspect-video w-full bg-muted/20">
                            <img
                                src={image.image_url}
                                alt={image.caption || "Cake detail"}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* DETAILS */}
                        <div className="p-6 md:p-8 space-y-6">
                            <div>
                                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                                    {image.category}
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {image.caption || "Delicious Creation"}
                                </h1>
                            </div>

                            {/* WHATSAPP CTA for consistency if they land here */}
                            <a
                                href={`https://wa.me/918420174756?text=${encodeURIComponent(
                                    `Hi CRAVORY 👋\nI’d like to order this cake 🍰\n\nCategory: ${image.category
                                    }\nDescription: ${image.caption || "—"
                                    }\n\nView cake:\nhttps://cravory-bakery.vercel.app/gallery/${id}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full md:w-auto"
                            >
                                Order this on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
