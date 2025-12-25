"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { AnimateOnView } from "@/components/animate-on-view"
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
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
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message || "Failed to load images")
      }

      setImages(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load images"
      setError(errorMessage)
      console.error("Gallery fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const staticCategories = ["Birthday Cakes", "Anniversary Cakes", "Custom Cakes", "Cupcakes", "Chocolates", "Sweet Cravings"]
  // Always show the defined categories (including "All") and allow client-side filtering
  const categories = ["All", ...staticCategories]

  const filteredImages = selectedCategory === "All" 
    ? images 
    : images.filter((img) => img.category === selectedCategory)

  return (
    <>
      <div className="relative z-10 min-h-screen">
        <Navbar />

      <div className="py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <AnimateOnView className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Gallery</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A glimpse of our delicious eggless creations
            </p>
          </AnimateOnView>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <motion.div className="mb-12">
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2 sm:justify-center sm:flex-wrap">
                {categories.map((category, idx) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`min-w-[120px] flex-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0 relative ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    {selectedCategory === category && (
                      <motion.div
                        layoutId="category-active"
                        className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {category}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {loading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading images...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-destructive text-lg">Error: {error}</p>
            </div>
          )}

          {!loading && !error && filteredImages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No images yet</p>
            </div>
          )}

          {!loading && !error && filteredImages.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <AnimateOnView delay={index * 0.05}>
                    <motion.div
                      whileHover={{ scale: 1.04, y: -4 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="cursor-pointer group h-full"
                    >
                      <Card 
                        className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/15 border-0 bg-background/50 backdrop-blur-sm h-full"
                        onClick={() => setSelectedImage(image)}
                      >
                        <div className="aspect-square relative overflow-hidden bg-muted/50 rounded-t-lg">
                          <img
                            src={image.image_url}
                            alt={image.caption || `Gallery image ${index + 1}`}
                            loading="lazy"
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      {image.caption && (
                        <div className="p-4 sm:p-5 bg-background">
                          <p className="text-sm text-foreground font-medium leading-relaxed line-clamp-2">{image.caption}</p>
                        </div>
                      )}
                    </Card>
                    </motion.div>
                  </AnimateOnView>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 z-10 text-white hover:text-white/80 hover:bg-white/10 rounded-full h-10 w-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="bg-background rounded-xl overflow-hidden shadow-2xl">
                <div className="relative">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.caption || "Gallery image"}
                    className="w-full h-auto max-h-[75vh] object-contain bg-muted/30"
                  />
                </div>
                {selectedImage.caption && (
                  <div className="p-6 sm:p-8 bg-background border-t border-border">
                    <p className="text-lg sm:text-xl text-foreground font-medium leading-relaxed">{selectedImage.caption}</p>
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
