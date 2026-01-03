"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"

/* ================= AUTO SCROLL CONFIG ================= */

const FORCE_AUTO_SCROLL = process.env.NODE_ENV === "development"

const AUTO_SCROLL_DELAY = 2400        // pause before start (premium)
const AUTO_SCROLL_SPEED = 0.4         // constant luxury speed
const AUTO_SCROLL_STOP_AT = 1.0      // stop at 70%
const AUTO_SCROLL_COOLDOWN_HOURS = 6  // prod only

/* ================= TYPES ================= */

interface GalleryImage {
    id: string
    image_url: string
    category: string
    caption: string
    created_at: string
}

/* ================= PAGE ================= */

export default function GalleryClient() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

    const searchParams = useSearchParams()

    /* ================= HANDLE URL QUERY PARAM ================= */
    useEffect(() => {
        const categoryParam = searchParams.get("category")
        if (categoryParam) {
            setSelectedCategory(categoryParam)
        }
    }, [searchParams])

    // NEW STATE STRUCTURE
    const [likedByUser, setLikedByUser] = useState<Record<string, boolean>>({})
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
    const [userId, setUserId] = useState<string>("")

    /* auto scroll refs */
    const rafId = useRef<number | null>(null)
    const userInterrupted = useRef(false)
    const hasAutoScrolled = useRef(false)

    /* ================= BODY SCROLL LOCK (MODAL) ================= */

    useEffect(() => {
        document.body.style.overflow = selectedImage ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [selectedImage])

    /* ================= FETCH IMAGES ================= */

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from("gallery_images")
                    .select("*")
                    .order("order_index", { ascending: true })
                    .order("created_at", { ascending: false })

                if (error) throw error
                setImages(data || [])
            } catch (err) {
                console.error(err)
                setError("Failed to load images")
            } finally {
                setLoading(false)
            }
        }

        fetchImages()
    }, [])

    /* ================= LOAD LIKES (USER + COUNTS) ================= */

    useEffect(() => {
        // 1. Get or create User ID
        let currentUserId = localStorage.getItem("cravory_user_id")
        if (!currentUserId) {
            currentUserId = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
            localStorage.setItem("cravory_user_id", currentUserId)
        }
        setUserId(currentUserId)

        const fetchLikestData = async () => {
            // Fetch User Likes
            if (currentUserId) {
                const { data: userData } = await supabase
                    .from("gallery_likes")
                    .select("image_id")
                    .eq("user_id", currentUserId)

                if (userData) {
                    const userMap: Record<number, boolean> = {}
                    userData.forEach((row: any) => {
                        userMap[row.image_id] = true
                    })
                    setLikedByUser(userMap)
                }
            }

            // Fetch ALL Likes for Counts (Aggregation)
            const { data: countData, error } = await supabase
                .from("gallery_like_counts")
                .select("image_id, count")

            if (error) {
                console.error("Like count error", error)
            }

            if (countData) {
                const counts: Record<number, number> = {}
                countData.forEach((row: any) => {
                    counts[row.image_id] = row.count
                })
                setLikeCounts(counts)
            }


        }

        fetchLikestData()
    }, [])

    /* ================= AUTO SCROLL EFFECT ================= */

    useEffect(() => {
        if (loading) return
        if (selectedImage) return
        if (images.length < 6) return
        if (hasAutoScrolled.current) return

        const lastTime = localStorage.getItem("cravory_gallery_last_scroll")

        if (!FORCE_AUTO_SCROLL && lastTime) {
            const diff = Date.now() - Number(lastTime)
            if (diff < AUTO_SCROLL_COOLDOWN_HOURS * 60 * 60 * 1000) return
        }

        hasAutoScrolled.current = true
        userInterrupted.current = false

        const stop = () => {
            userInterrupted.current = true
            hasAutoScrolled.current = true

            // force final position to stop momentum
            window.scrollTo({ top: window.scrollY, behavior: "auto" })

            if (rafId.current) {
                cancelAnimationFrame(rafId.current)
                rafId.current = null
            }
        }



        window.addEventListener("wheel", stop, { passive: false })
        window.addEventListener("touchmove", stop, { passive: false })
        window.addEventListener("pointerdown", stop)
        window.addEventListener("keydown", stop)

        const isMobile = window.innerWidth <= 768

        const start = () => {
            const startY = window.scrollY
            const maxScroll =
                (document.documentElement.scrollHeight - window.innerHeight) *
                AUTO_SCROLL_STOP_AT

            if (maxScroll <= startY) return

            let progress = 0

            const step = () => {
                if (userInterrupted.current) return

                // UPDATED MATH: visible speed on mobile
                const speed = isMobile
                    ? AUTO_SCROLL_SPEED * 0.35   // 👈 phone = much slower
                    : AUTO_SCROLL_SPEED

                const divisor = 1200          // 👈 same for all devices

                progress += speed


                const t = Math.min(progress / divisor, 1)


                const y = startY + t * (maxScroll - startY)
                window.scrollTo({ top: y, behavior: "auto" })

                if (t < 1) {
                    rafId.current = requestAnimationFrame(step)
                } else {
                    if (!FORCE_AUTO_SCROLL) {
                        localStorage.setItem(
                            "cravory_gallery_last_scroll",
                            Date.now().toString()
                        )
                    }
                }
            }

            rafId.current = requestAnimationFrame(step)
        }

        const timer = setTimeout(start, AUTO_SCROLL_DELAY)

        return () => {
            clearTimeout(timer)

            if (rafId.current) {
                cancelAnimationFrame(rafId.current)
                rafId.current = null
            }

            window.removeEventListener("wheel", stop)
            window.removeEventListener("touchstart", stop)
            window.removeEventListener("pointerdown", stop)
            window.removeEventListener("keydown", stop)
        }

    }, [loading, images, selectedImage])

    /* ================= LOGIC ================= */

    const categories = [
        "All",
        "Birthday Cakes",
        "Anniversary Cakes",
        "Custom Cakes",
        "Cupcakes",
        "Chocolates",
        "Sweet Cravings",
    ]

    const filteredImages =
        selectedCategory === "All"
            ? images
            : images.filter((img) => img.category === selectedCategory)

    // STRICT TOGGLE LIKE IMPLEMENTATION
    const toggleLike = async (imageId: string) => {
        if (!userId) return

        const alreadyLiked = likedByUser[imageId]

        // Optimistic UI
        setLikedByUser(prev => ({ ...prev, [imageId]: !alreadyLiked }))
        setLikeCounts(prev => ({
            ...prev,
            [imageId]: Math.max(0, (prev[imageId] || 0) + (alreadyLiked ? -1 : 1))
        }))

        try {
            if (alreadyLiked) {
                await supabase
                    .from("gallery_likes")
                    .delete()
                    .match({ user_id: userId, image_id: imageId })
            } else {
                await supabase
                    .from("gallery_likes")
                    .insert({ user_id: userId, image_id: imageId })
            }
        } catch (err) {
            console.error("Like toggle failed", err)

            // Rollback UI if DB fails
            setLikedByUser(prev => ({ ...prev, [imageId]: alreadyLiked }))
            setLikeCounts(prev => ({
                ...prev,
                [imageId]: Math.max(
                    0,
                    (prev[imageId] || 0) + (alreadyLiked ? 1 : -1)
                )
            }))
        }
    }

    /* ================= RENDER ================= */
    const openWhatsAppOrder = (image: GalleryImage) => {
        const phone = "918420174756"
        const DOMAIN = "https://cravory-bakery.vercel.app"

        const message = `
Hi CRAVORY 👋
I’d like to order this cake 🍰

Category: ${image.category || "Cake"}
Description: ${image.caption || "—"}

View cake:
${DOMAIN}/gallery/${image.id}
`.trim()

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        window.open(url, "_blank")
    }

    return (
        <div className="relative z-10 min-h-screen">
            <Navbar />

            {/* HEADER */}
            <div className="py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Gallery</h1>
                    <p className="text-lg text-muted-foreground">
                        A glimpse of our delicious eggless creations
                    </p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="py-16">
                <div className="container mx-auto px-4">

                    {/* CATEGORIES */}
                    <div className="mb-12 flex gap-3 justify-center flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === category
                                    ? "bg-primary text-primary-foreground shadow"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* STATES */}
                    {loading && (
                        <div className="text-center py-20 text-muted-foreground">
                            Loading images...
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20 text-destructive">
                            {error}
                        </div>
                    )}

                    {!loading && !error && filteredImages.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            Baking something special… 🍰
                        </div>
                    )}

                    {/* GRID */}
                    {!loading && !error && filteredImages.length > 0 && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCategory}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                            >
                                {filteredImages.map((image) => {
                                    const isLiked = !!likedByUser[image.id]
                                    const count = likeCounts[image.id] || 0

                                    return (
                                        <Card
                                            key={image.id}
                                            onClick={() => setSelectedImage(image)}
                                            className="group relative cursor-pointer overflow-hidden border-0 bg-background/60 backdrop-blur hover:shadow-xl transition"
                                        >
                                            <div className="aspect-square relative overflow-hidden">

                                                <img
                                                    src={image.image_url}
                                                    alt={image.caption || "Gallery image"}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* 🟢 WHATSAPP CTA – TOP LEFT */}
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openWhatsAppOrder(image)
                                                    }}
                                                    className="
                            absolute top-3 left-3 z-10
                            px-3 py-1.5 rounded-full
                            bg-green-600/90 text-white text-xs font-medium
                            cursor-pointer
                            opacity-100 md:opacity-0 md:group-hover:opacity-100
                            transition-opacity duration-200 shadow-sm
                            flex items-center gap-1.5
                          "
                                                >
                                                    <span>Order on WhatsApp</span>
                                                </div>

                                                {/* ❤️ LIKE – TOP RIGHT */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleLike(image.id)
                                                    }}
                                                    className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/90 p-2 shadow md:opacity-0 md:group-hover:opacity-100 transition"
                                                >
                                                    <Heart
                                                        className={`h-5 w-5 ${isLiked ? "fill-rose-600 text-rose-600" : "text-gray-600"
                                                            }`}
                                                    />

                                                    {/* subtle like count: only if > 0 */}
                                                    {count > 0 && (
                                                        <span className="text-xs text-gray-600 leading-none">
                                                            {count}
                                                        </span>
                                                    )}
                                                </button>


                                                {/* DESKTOP CAPTION */}
                                                {image.caption && (
                                                    <div className="pointer-events-none absolute inset-0 hidden md:flex items-end">
                                                        <div className="w-full p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <p className="text-sm text-white font-medium line-clamp-2">
                                                                {image.caption}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>


                                            {/* MOBILE CAPTION */}
                                            {image.caption && (
                                                <div className="p-4 md:hidden">
                                                    <p className="text-sm font-medium line-clamp-2">
                                                        {image.caption}
                                                    </p>
                                                </div>
                                            )}
                                        </Card>
                                    )
                                })}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="relative max-w-5xl w-full"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute -top-12 right-0 text-white"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X />
                            </Button>

                            <div className="relative bg-background rounded-xl overflow-hidden">
                                <img
                                    src={selectedImage.image_url}
                                    className="w-full max-h-[80vh] object-contain"
                                />

                                {/* ❤️ MODAL LIKE */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleLike(selectedImage.id)
                                    }}
                                    className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 p-2.5 shadow transition"
                                >
                                    <Heart
                                        className={`h-6 w-6 ${likedByUser[selectedImage.id]
                                            ? "fill-rose-600 text-rose-600"
                                            : "text-gray-600"
                                            }`}
                                    />
                                    {likeCounts[selectedImage.id] > 0 && (
                                        <span className="text-sm text-gray-600 font-medium leading-none">
                                            {likeCounts[selectedImage.id]}
                                        </span>
                                    )}
                                </button>
                                <div className="p-6 border-t space-y-4">
                                    {selectedImage.caption && (
                                        <p className="text-lg font-medium">
                                            {selectedImage.caption}
                                        </p>
                                    )}

                                    <Button
                                        className="w-full py-6 text-base"
                                        onClick={() => openWhatsAppOrder(selectedImage)}
                                    >
                                        Order this cake on WhatsApp
                                    </Button>
                                </div>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    )
}