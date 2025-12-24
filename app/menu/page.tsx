"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MenuSection } from "@/components/menu-section"
import { Cake, Cherry, Candy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface MenuItem {
  id: string
  category: string
  subcategory: string | null
  item_name: string
  price_label: string
  price: number
  created_at: string
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [menuData, setMenuData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category", { ascending: true })
        .order("subcategory", { ascending: true })
        .order("item_name", { ascending: true })

      if (error) throw error

      const transformed = transformMenuData(data || [])
      setMenuData(transformed)
    } catch (err) {
      console.error("Error fetching menu items:", err)
      setMenuData(getDefaultMenuData())
    } finally {
      setLoading(false)
    }
  }

  const transformMenuData = (items: MenuItem[]) => {
    const grouped: Record<string, Record<string, any[]>> = {}

    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = {}
      }
      if (!grouped[item.category][item.item_name]) {
        grouped[item.category][item.item_name] = []
      }
      grouped[item.category][item.item_name].push({
        price_label: item.price_label,
        price: item.price,
        subcategory: item.subcategory,
      })
    })

    const result: any = {
      cakes: {
        title: "Cakes (Eggless)",
        subtitle: "Customized cakes available",
        items: [],
        special: null,
      },
      cupcakes: {
        title: "Cupcakes (Eggless)",
        classic: [],
        premium: [],
        chocolate: [],
        boxes: [],
      },
      jarCakes: {
        title: "Jar Cakes (Eggless)",
        items: [],
      },
      cheesecake: {
        title: "Cheesecake Slice (Eggless)",
        items: [],
      },
      chocolates: {
        title: "Chocolates (Eggless)",
        varieties: [],
        flavours: [],
      },
      liquorChocolates: {
        title: "Liquor Chocolates (Vodka-infused)",
        boxes: [],
        flavours: [],
      },
      cakesicles: {
        title: "Cakesicles (Eggless)",
        offer: "2 for ₹99",
        description: "All flavours available",
        items: [],
      },
      popsicles: {
        title: "Popsicles (Eggless)",
        offer: "3 for ₹99",
        description: "All flavours available",
        items: [],
      },
    }

    const extractPieces = (text: string): number | null => {
      const match = text.match(/(\d+)\s*(?:pcs|pieces|pc)/i)
      return match ? parseInt(match[1]) : null
    }

    Object.keys(grouped).forEach((category) => {
      const categoryLower = category.toLowerCase().trim()

      if (categoryLower === "cakes") {
        Object.keys(grouped[category]).forEach((itemName) => {
          const prices = grouped[category][itemName]
          const halfPound = prices.find((p) => p.price_label === "Half Pound")
          const onePound = prices.find((p) => p.price_label === "1 Pound")

          if (halfPound || onePound) {
            const itemData = {
              name: itemName,
              halfPound: halfPound?.price || 0,
              onePound: onePound?.price || 0,
            }
            if (itemName.toLowerCase().includes("dry fruit") || itemName.toLowerCase().includes("nut") || itemName.toLowerCase().includes("no maida")) {
              result.cakes.special = itemData
            } else {
              result.cakes.items.push(itemData)
            }
          }
        })
      } else if (categoryLower === "cupcakes") {
        const cupcakeBySubcategory: Record<string, any[]> = {
          Classic: [],
          Premium: [],
          "Chocolate Specials": [],
        }
        const cupcakeBoxes: any[] = []
        const processedItems = new Set<string>()

        items
          .filter((item) => item.category.toLowerCase().trim() === "cupcakes")
          .forEach((item) => {
            const price = item.price
            const priceLabel = item.price_label.toLowerCase()
            const itemKey = `${item.item_name}-${item.subcategory || ""}`

            if (priceLabel.includes("pcs") || priceLabel.includes("pieces")) {
              const pieces = extractPieces(item.price_label) || extractPieces(item.item_name)
              if (pieces && pieces > 0 && !cupcakeBoxes.find((b) => b.pieces === pieces && b.item_name === item.item_name)) {
                cupcakeBoxes.push({
                  pieces,
                  price,
                  item_name: item.item_name,
                })
              }
            } else if (item.subcategory && !processedItems.has(itemKey)) {
              const subcategoryKey = item.subcategory as keyof typeof cupcakeBySubcategory
              if (cupcakeBySubcategory[subcategoryKey]) {
                cupcakeBySubcategory[subcategoryKey].push({
                  name: item.item_name,
                  price,
                })
                processedItems.add(itemKey)
              }
            } else if (!item.subcategory && !processedItems.has(itemKey)) {
              cupcakeBySubcategory.Classic.push({
                name: item.item_name,
                price,
              })
              processedItems.add(itemKey)
            }
          })

        result.cupcakes.classic = cupcakeBySubcategory.Classic
        result.cupcakes.premium = cupcakeBySubcategory.Premium
        result.cupcakes.chocolate = cupcakeBySubcategory["Chocolate Specials"]
        result.cupcakes.boxes = cupcakeBoxes.sort((a, b) => a.pieces - b.pieces)
      } else if (categoryLower === "jar cakes") {
        Object.keys(grouped[category]).forEach((itemName) => {
          const prices = grouped[category][itemName]
          const priceItem = prices.find((p) => p.price_label === "Per Piece" || p.price_label === "Price") || prices[0]
          if (priceItem && priceItem.price > 0) {
            result.jarCakes.items.push({
              name: itemName,
              price: priceItem.price,
            })
          }
        })
      } else if (categoryLower === "cheesecake") {
        Object.keys(grouped[category]).forEach((itemName) => {
          const prices = grouped[category][itemName]
          const priceItem = prices.find((p) => p.price_label === "Slice" || p.price_label === "Per Piece" || p.price_label === "Price") || prices[0]
          if (priceItem && priceItem.price > 0) {
            result.cheesecake.items.push({
              name: itemName,
              price: priceItem.price,
            })
          }
        })
      } else if (categoryLower === "chocolates") {
        const chocolateByFlavour: Record<string, { price: number; boxes: any[] }> = {}

        items
          .filter((item) => item.category.toLowerCase().trim() === "chocolates")
          .forEach((item) => {
            const flavour = item.item_name
            const price = item.price
            const priceLabel = item.price_label.toLowerCase()
            const pieces = extractPieces(item.price_label) || extractPieces(item.item_name)

            if (!chocolateByFlavour[flavour]) {
              chocolateByFlavour[flavour] = { price: 0, boxes: [] }
            }

            if (priceLabel === "per piece" || priceLabel === "price") {
              chocolateByFlavour[flavour].price = price
            } else if (pieces && pieces > 0) {
              chocolateByFlavour[flavour].boxes.push({
                pieces,
                price,
              })
            }
          })

        result.chocolates.varieties = Object.keys(chocolateByFlavour)
        result.chocolates.flavours = Object.keys(chocolateByFlavour)
          .filter(flavour => chocolateByFlavour[flavour].price > 0)
          .map((flavour) => ({
            name: flavour,
            price: chocolateByFlavour[flavour].price,
            boxes: chocolateByFlavour[flavour].boxes.sort((a: any, b: any) => a.pieces - b.pieces),
          }))
      } else if (categoryLower === "liquor chocolates") {
        const liquorByFlavour: Record<string, { price: number; boxes: any[] }> = {}

        items
          .filter((item) => item.category.toLowerCase().trim() === "liquor chocolates")
          .forEach((item) => {
            const flavour = item.item_name
            const price = item.price
            const priceLabel = item.price_label.toLowerCase()
            const pieces = extractPieces(item.price_label) || extractPieces(item.item_name)

            if (!liquorByFlavour[flavour]) {
              liquorByFlavour[flavour] = { price: 0, boxes: [] }
            }

            if (priceLabel === "per piece" || priceLabel === "price") {
              liquorByFlavour[flavour].price = price
            } else if (pieces && pieces > 0) {
              liquorByFlavour[flavour].boxes.push({
                pieces,
                price,
              })
            }
          })

        result.liquorChocolates.flavours = Object.keys(liquorByFlavour)
          .filter(flavour => liquorByFlavour[flavour].price > 0)
          .map((flavour) => ({
            name: flavour,
            price: liquorByFlavour[flavour].price,
            boxes: liquorByFlavour[flavour].boxes.sort((a: any, b: any) => a.pieces - b.pieces),
          }))
      } else if (categoryLower === "cakesicles") {
        const cakesicleItems: any[] = []

        items
          .filter((item) => item.category.toLowerCase().trim() === "cakesicles")
          .forEach((item) => {
            cakesicleItems.push({
              name: item.item_name,
              price_label: item.price_label,
              price: item.price,
            })
          })

        if (cakesicleItems.length > 0) {
          result.cakesicles.items = cakesicleItems
          const firstItem = cakesicleItems[0]
          result.cakesicles.offer = firstItem.price_label || "2 for ₹99"
          result.cakesicles.description = "All flavours available"
        }
      } else if (categoryLower === "popsicles") {
        const popsicleItems: any[] = []

        items
          .filter((item) => item.category.toLowerCase().trim() === "popsicles")
          .forEach((item) => {
            popsicleItems.push({
              name: item.item_name,
              price_label: item.price_label,
              price: item.price,
            })
          })

        if (popsicleItems.length > 0) {
          result.popsicles.items = popsicleItems
          const firstItem = popsicleItems[0]
          result.popsicles.offer = firstItem.price_label || "3 for ₹99"
          result.popsicles.description = "All flavours available"
        }
      }
    })

    return result
  }

  const getDefaultMenuData = () => ({
    cakes: {
      title: "Cakes (Eggless)",
      subtitle: "Customized cakes available",
      items: [],
      special: null,
    },
    cupcakes: {
      title: "Cupcakes (Eggless)",
      classic: [],
      premium: [],
      chocolate: [],
      boxes: [],
    },
    jarCakes: {
      title: "Jar Cakes (Eggless)",
      items: [],
    },
    cheesecake: {
      title: "Cheesecake Slice (Eggless)",
      items: [],
    },
    chocolates: {
      title: "Chocolates (Eggless)",
      varieties: [],
      flavours: [],
    },
    liquorChocolates: {
      title: "Liquor Chocolates (Vodka-infused)",
      boxes: [],
      flavours: [],
    },
    cakesicles: {
      title: "Cakesicles (Eggless)",
      offer: "2 for ₹99",
      description: "All flavours available",
      items: [],
    },
    popsicles: {
      title: "Popsicles (Eggless)",
      offer: "3 for ₹99",
      description: "All flavours available",
      items: [],
    },
  })

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(categoryId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
        <div className="absolute top-60 right-10 w-24 h-24 bg-secondary/5 rounded-full animate-float-delay" />
        <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-accent/5 rounded-full animate-float-slow" />
        <div className="absolute top-1/2 right-1/4 w-36 h-36 bg-[#B5EAD7]/5 rounded-full animate-float" />
      </div>

      <div className="absolute left-10 top-[30%] hidden lg:block animate-float">
        <Cake className="w-20 h-20 text-primary/15 rotate-12" />
      </div>
      <div className="absolute right-10 top-[45%] hidden lg:block animate-float-delay">
        <Cherry className="w-16 h-16 text-secondary/15 -rotate-12" />
      </div>
      <div className="absolute left-20 bottom-40 hidden lg:block animate-float-slow">
        <Candy className="w-18 h-18 text-accent/15" />
      </div>

      <div className="py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 animate-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Our Menu</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our complete range of delicious eggless desserts
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 justify-center overflow-x-auto scrollbar-hide">
            <Button
              variant={activeCategory === "cakes" ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory("cakes")}
              className="whitespace-nowrap rounded-full"
            >
              Cakes
            </Button>
            <Button
              variant={activeCategory === "cupcakes" ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory("cupcakes")}
              className="whitespace-nowrap rounded-full"
            >
              Cupcakes
            </Button>
            <Button
              variant={activeCategory === "jar-cakes" ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory("jar-cakes")}
              className="whitespace-nowrap rounded-full"
            >
              Jar Cakes
            </Button>
            <Button
              variant={activeCategory === "cheesecake" ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory("cheesecake")}
              className="whitespace-nowrap rounded-full"
            >
              Cheesecake
            </Button>
            <Button
              variant={activeCategory === "chocolates" ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory("chocolates")}
              className="whitespace-nowrap rounded-full"
            >
              Chocolates
            </Button>
            <Button
              variant={activeCategory === "liquor-chocolates" ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory("liquor-chocolates")}
              className="whitespace-nowrap rounded-full"
            >
              Liquor Chocolates
            </Button>
            <Button
              variant={activeCategory === "cakesicles-popsicles" ? "default" : "ghost"}
              size="sm"
              onClick={() => scrollToCategory("cakesicles-popsicles")}
              className="whitespace-nowrap rounded-full"
            >
              Cakesicles & Popsicles
            </Button>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-16">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading menu...</p>
            </div>
          ) : menuData ? (
            <MenuSection data={menuData} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu items available</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
