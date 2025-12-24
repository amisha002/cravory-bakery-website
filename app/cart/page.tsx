"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag, Cake, Cookie, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePlaceOrder = () => {
    if (items.length === 0) return

    let message = "Hi! I'd like to order:%0A%0A"

    items.forEach((item) => {
      message += `• ${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}%0A`
    })

    message += `%0ATotal: ₹${totalPrice}%0A%0APlease confirm my order. Thank you!`

    window.open(`https://wa.me/918420174756?text=${message}`, "_blank")
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full animate-float-delay" />
          <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-accent/5 rounded-full animate-float-slow" />
        </div>

        <div className="absolute left-10 top-1/3 hidden lg:block animate-float">
          <ShoppingBag className="w-20 h-20 mx-auto text-primary/10 mb-6 animate-bounce-slow" />
        </div>
        <div className="absolute right-10 top-1/2 hidden lg:block animate-float-delay">
          <Cake className="w-24 h-24 text-secondary/10" />
        </div>

        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4 animate-fade-in-up">
            <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground mb-6 animate-bounce-slow" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Looks like you haven't added any delicious items to your cart yet.
            </p>
            <Link href="/menu">
              <Button size="lg" className="rounded-full hover:scale-105 transition-transform">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
        <div className="absolute top-60 right-10 w-24 h-24 bg-secondary/5 rounded-full animate-float-delay" />
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-accent/5 rounded-full animate-float-slow" />
      </div>

      <div className="absolute left-10 top-[40%] hidden lg:block animate-float">
        <Cookie className="w-16 h-16 text-primary/15" />
      </div>
      <div className="absolute right-10 top-[55%] hidden lg:block animate-float-delay">
        <Sparkles className="w-14 h-14 text-accent/15" />
      </div>

      <div className="py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 animate-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Your Cart</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">Review your order and place it via WhatsApp</p>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4 mb-8">
            {items.map((item, index) => (
              <Card
                key={`${item.name}-${index}`}
                className="hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-primary font-semibold mt-2">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full hover:scale-110 transition-transform"
                          onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full hover:scale-110 transition-transform"
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:scale-110 transition-transform"
                        onClick={() => removeItem(item.name)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary animate-scale-in hover:shadow-2xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-3xl font-bold text-primary">₹{totalPrice}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 rounded-full gap-2 hover:scale-105 transition-transform"
                  onClick={handlePlaceOrder}
                >
                  <MessageCircle className="h-5 w-5" />
                  Place Order on WhatsApp
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent hover:scale-105 transition-transform"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>

              <p className="text-sm text-center text-muted-foreground mt-4">
                You'll be redirected to WhatsApp to complete your order
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
