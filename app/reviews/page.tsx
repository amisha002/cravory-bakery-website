"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { AnimateOnView } from "@/components/animate-on-view"
import { DecorativeBackground } from "@/components/decorative-background"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export const dynamic = "force-dynamic"

interface Review {
  name: string
  rating: number
  review: string
  image_url: string | null
  created_at: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    review: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message || "Failed to load reviews")
      }

      setReviews(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load reviews"
      setError(errorMessage)
      console.error("Reviews fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.review || formData.rating === 0) {
      toast({
        title: "Please complete all fields",
        description: "Name, rating, and review are required",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      let imageUrl: string | null = null

      if (selectedImage) {
        const fileExt = selectedImage.name.split(".").pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = fileName

        const { error: uploadError } = await supabase.storage
          .from("review-images")
          .upload(filePath, selectedImage)

        if (uploadError) {
          throw new Error(uploadError.message || "Failed to upload image")
        }

        const { data: { publicUrl } } = supabase.storage
          .from("review-images")
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      const { error: insertError } = await supabase
        .from("reviews")
        .insert([
          {
            name: formData.name,
            rating: formData.rating,
            review: formData.review,
            image_url: imageUrl,
          },
        ])

      if (insertError) {
        throw new Error(insertError.message || "Failed to submit review")
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your experience",
      })

      setFormData({ name: "", rating: 0, review: "" })
      setSelectedImage(null)
      setImagePreview(null)
      
      const fileInput = document.getElementById("review-image") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      await fetchReviews()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit review"
      console.error("Review submit error:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <DecorativeBackground />
      <div className="relative z-10 min-h-screen">
        <Navbar />

      <div className="py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <AnimateOnView className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Customer Reviews</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              See what our happy customers have to say about CRAVORY
            </p>
          </AnimateOnView>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Card className="mb-16 border-2 border-primary/20 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-8 sm:p-10">
              <h2 className="text-3xl font-bold mb-2 text-foreground">Share Your Experience</h2>
              <p className="text-muted-foreground mb-8">We'd love to hear from you!</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="review-name" className="text-base font-medium">Your Name *</Label>
                  <Input
                    id="review-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Your Rating *</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`h-9 w-9 transition-colors duration-200 ${
                            star <= formData.rating
                              ? "fill-primary text-primary drop-shadow-sm"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-text" className="text-base font-medium">Your Review *</Label>
                  <Textarea
                    id="review-text"
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    placeholder="Tell us about your experience with CRAVORY..."
                    rows={5}
                    className="resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-image" className="text-base font-medium">Image (Optional)</Label>
                  <Input
                    id="review-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-border shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Error: {error}</p>
            </div>
          )}

          {!loading && !error && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <AnimateOnView key={index} delay={index * 0.1}>
                  <Card className="h-full flex flex-col border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary drop-shadow-sm" />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, i) => (
                        <Star key={`empty-${i}`} className="h-5 w-5 text-muted-foreground/20" />
                      ))}
                    </div>
                    <p className="text-foreground mb-5 leading-relaxed text-[15px] flex-1">{review.review}</p>
                    {review.image_url && (
                      <div className="mb-5 -mx-2 sm:-mx-3">
                        <img
                          src={review.image_url}
                          alt="Review image"
                          className="w-full h-48 sm:h-52 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="pt-4 border-t border-border/50 mt-auto">
                      <p className="font-semibold text-foreground mb-1">{review.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                </AnimateOnView>
              ))}
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          )}
        </div>
      </div>

        <Footer />
      </div>
    </>
  )
}
