"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

interface GalleryImage {
  image_url: string
  category: string
  caption: string
  created_at: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  // prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedImage])

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
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

  return (
    <>
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* CATEGORIES */}
            <div className="mb-12 flex gap-3 justify-center flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
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
                No images found
              </div>
            )}

            {/* GRID */}
            {!loading && !error && filteredImages.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {filteredImages.map((image) => (
                    <motion.div
                      key={`${image.image_url}-${image.created_at}`}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Card
                        onClick={() => setSelectedImage(image)}
                        className="cursor-pointer overflow-hidden border-0 bg-background/60 backdrop-blur hover:shadow-xl transition"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.image_url}
                            alt={image.caption || "Gallery image"}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>

                        {image.caption && (
                          <div className="p-4">
                            <p className="text-sm font-medium line-clamp-2">
                              {image.caption}
                            </p>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
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

                <div className="bg-background rounded-xl overflow-hidden">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.caption || "Gallery image"}
                    className="w-full max-h-[80vh] object-contain"
                  />
                  {selectedImage.caption && (
                    <div className="p-6 border-t">
                      <p className="text-lg font-medium">
                        {selectedImage.caption}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  )
}
