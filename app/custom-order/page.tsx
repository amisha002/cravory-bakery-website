"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Upload, X, Cake, Gift, PartyPopper } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cakeType: "",
    weight: "",
    flavour: "",
    occasion: "",
    message: "",
    additionalNotes: "",
  })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.cakeType || !formData.weight || !formData.flavour) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    const orderDetails = `
Hi! I'd like to place a custom order:%0A%0A
Name: ${formData.name}%0A
Phone: ${formData.phone}%0A
Cake Type: ${formData.cakeType}%0A
Weight: ${formData.weight}%0A
Flavour: ${formData.flavour}%0A
Occasion: ${formData.occasion}%0A
Message on Cake: ${formData.message}%0A
Additional Notes: ${formData.additionalNotes}%0A
${uploadedImage ? "Reference Image: Attached" : ""}
    `.trim()

    window.open(`https://wa.me/918420174756?text=${orderDetails}`, "_blank")
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
        <div className="absolute top-60 right-10 w-24 h-24 bg-secondary/5 rounded-full animate-float-delay" />
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-accent/5 rounded-full animate-float-slow" />
      </div>

      <div className="absolute left-10 top-[30%] hidden lg:block animate-float">
        <Cake className="w-20 h-20 text-primary/15 rotate-12" />
      </div>
      <div className="absolute right-10 top-[45%] hidden lg:block animate-float-delay">
        <Gift className="w-18 h-18 text-secondary/15" />
      </div>
      <div className="absolute left-20 bottom-40 hidden lg:block animate-float-slow">
        <PartyPopper className="w-16 h-16 text-accent/15" />
      </div>

      <div className="py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 animate-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Customized Orders</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Create your perfect custom cake for any special occasion
            </p>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-8 animate-fade-in-up">
            <p className="text-muted-foreground italic leading-relaxed">
              Your custom cake will be <span className="font-semibold text-primary">baked with love by Aishwarya</span>
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3 items-start">
            <div className="md:col-span-1">
              <section aria-labelledby="custom-orders-header" className="mb-6">
                <h2 id="custom-orders-header" className="text-3xl md:text-4xl font-bold leading-snug">Custom Orders</h2>
                <p className="text-muted-foreground mt-2 leading-relaxed">Made with love for every sweet occasion</p>
              </section>

              <section aria-labelledby="why-choose" className="grid gap-4 mb-6">
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Cake className="h-6 w-6 text-primary/80" />
                    <div>
                      <h3 className="font-semibold">Freshly Handmade</h3>
                      <p className="text-sm text-muted-foreground">Lovingly prepared in small batches to ensure freshness.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Gift className="h-6 w-6 text-secondary/80" />
                    <div>
                      <h3 className="font-semibold">Premium Ingredients</h3>
                      <p className="text-sm text-muted-foreground">We use high-quality ingredients for rich flavours and texture.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
                  <div className="flex items-start gap-3">
                    <PartyPopper className="h-6 w-6 text-accent/80" />
                    <div>
                      <h3 className="font-semibold">Made to Order</h3>
                      <p className="text-sm text-muted-foreground">Custom sizes, flavours and designs tailored to your event.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section aria-labelledby="customize-what" className="mb-6">
                <h3 id="customize-what" className="text-lg font-semibold mb-3">What Can Be Customized</h3>
                <div className="flex gap-3 flex-wrap">
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <p className="font-medium">Cakes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <p className="font-medium">Cupcakes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <p className="font-medium">Dessert Boxes</p>
                  </div>
                </div>
              </section>

              <section aria-labelledby="how-to-order" className="mb-6">
                <h3 id="how-to-order" className="text-lg font-semibold mb-2">How to Order</h3>
                <p className="text-muted-foreground mb-4">Share your inspiration &amp; requirements — we'll take it from there.</p>
                <div className="flex gap-3 flex-wrap">
                  <Button asChild>
                    <a href="https://wa.me/918420174756" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>

                  <Button asChild variant="outline">
                    <a href="tel:8420174756" className="inline-flex items-center gap-2">
                      Call Us
                    </a>
                  </Button>
                </div>
              </section>

              <section className="mb-6">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold">Ready to create something special?</h4>
                      <p className="text-sm text-muted-foreground">Start by filling the form below — we'll follow up on WhatsApp.</p>
                    </div>
                    <div>
                      <Button onClick={() => { const el = document.getElementById('design-upload'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>Start Your Order</Button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="md:col-span-2">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="animate-scale-in hover:shadow-2xl transition-shadow">
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Reference Design Image (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-all hover:scale-105 duration-300">
                    {uploadedImage ? (
                      <div className="relative inline-block animate-fade-in">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Reference design"
                          className="max-h-48 rounded-lg"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 rounded-full hover:scale-110 transition-transform"
                          onClick={() => setUploadedImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="design-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground animate-bounce-slow" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a reference image for your custom cake
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full bg-transparent hover:scale-105 transition-transform"
                          asChild
                        >
                          <span>Choose Image</span>
                        </Button>
                        <input
                          id="design-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cakeType">Cake Type *</Label>
                  <Select
                    value={formData.cakeType}
                    onValueChange={(value) => setFormData({ ...formData, cakeType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cake type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular Cake">Regular Cake</SelectItem>
                      <SelectItem value="Photo Cake">Photo Cake</SelectItem>
                      <SelectItem value="Tier Cake">Tier Cake</SelectItem>
                      <SelectItem value="Designer Cake">Designer Cake</SelectItem>
                      <SelectItem value="Fondant Cake">Fondant Cake</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight *</Label>
                    <Select
                      value={formData.weight}
                      onValueChange={(value) => setFormData({ ...formData, weight: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Half Pound">Half Pound</SelectItem>
                        <SelectItem value="1 Pound">1 Pound</SelectItem>
                        <SelectItem value="1.5 Pounds">1.5 Pounds</SelectItem>
                        <SelectItem value="2 Pounds">2 Pounds</SelectItem>
                        <SelectItem value="3 Pounds">3 Pounds</SelectItem>
                        <SelectItem value="4 Pounds">4 Pounds</SelectItem>
                        <SelectItem value="5+ Pounds">5+ Pounds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flavour">Flavour *</Label>
                    <Select
                      value={formData.flavour}
                      onValueChange={(value) => setFormData({ ...formData, flavour: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select flavour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vanilla">Vanilla</SelectItem>
                        <SelectItem value="Chocolate">Chocolate</SelectItem>
                        <SelectItem value="Strawberry">Strawberry</SelectItem>
                        <SelectItem value="Pineapple">Pineapple</SelectItem>
                        <SelectItem value="Black Forest">Black Forest</SelectItem>
                        <SelectItem value="White Forest">White Forest</SelectItem>
                        <SelectItem value="Butterscotch">Butterscotch</SelectItem>
                        <SelectItem value="Red Velvet">Red Velvet</SelectItem>
                        <SelectItem value="Oreo">Oreo</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occasion">Occasion</Label>
                  <Input
                    id="occasion"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    placeholder="Birthday, Anniversary, Wedding, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message on Cake</Label>
                  <Input
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Happy Birthday, Congratulations, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes / Design Details</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Any specific design requirements, color preferences, or special instructions..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full gap-2 hover:scale-105 transition-transform"
                >
                  <MessageCircle className="h-5 w-5" />
                  Submit Order via WhatsApp
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  You'll be redirected to WhatsApp to finalize your custom order
                </p>
              </form>
            </CardContent>
          </Card>
          </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
