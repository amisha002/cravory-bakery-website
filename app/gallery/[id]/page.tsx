"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"

export default function GalleryDetailPage() {
    const { id } = useParams()
    const [image, setImage] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchImage = async () => {
            const { data } = await supabase
                .from("gallery_images")
                .select("*")
                .eq("id", id)
                .single()

            setImage(data)
            setLoading(false)
        }

        fetchImage()
    }, [id])

    if (loading) {
        return <div className="py-20 text-center">Loading…</div>
    }

    if (!image) {
        return <div className="py-20 text-center">Image not found</div>
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-10">
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
https://cravory-bakery.vercel.app/gallery/${image.id}`
                    )}`}
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-11 px-8"
                >
                    Order on WhatsApp
                </a>
            </main>

            <Footer />
        </div>
    )
}
