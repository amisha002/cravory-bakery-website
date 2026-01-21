"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MenuSection } from "@/components/menu-section"
import { Cake, Cherry, Candy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface MenuItem {
  id: string
  category: string
  category_id?: string
  subcategory: string | null
  item_name: string
  price_label: string
  price: number
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
}

function MenuContent() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<string>("default")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("is_active", true)
        .order("order_index")

      if (catError) throw catError
      setCategories(catData || [])

      // Fetch items
      const { data: itemData, error: itemError } = await supabase
        .from("menu_items")
        .select("*")
        .order("category", { ascending: true })
        .order("subcategory", { ascending: true })
        .order("item_name", { ascending: true })

      if (itemError) throw itemError
      setMenuItems(itemData || [])

    } catch (err) {
      console.error("Error fetching menu items:", err)
    } finally {
      setLoading(false)
    }
  }

  const transformMenuData = (items: MenuItem[], cats: Category[]) => {
    const grouped: Record<string, Record<string, any[]>> = {}

    items.forEach((item) => {
      const catName = item.category
      if (!grouped[catName]) {
        grouped[catName] = {}
      }
      if (!grouped[catName][item.item_name]) {
        grouped[catName][item.item_name] = []
      }
      grouped[catName][item.item_name].push({
        price_label: item.price_label,
        price: item.price,
        subcategory: item.subcategory,
      })
    })

    const result: any = {}
    cats.forEach(cat => {
      result[cat.slug] = {
        id: cat.id,
        title: cat.name,
        slug: cat.slug,
        items: [],
        dynamic: true
      }
    })

    const extractPieces = (text: string): number | null => {
      const match = text.match(/(\d+)\s*(?:pcs|pieces|pc)/i)
      return match ? parseInt(match[1]) : null
    }

    Object.keys(grouped).forEach((category) => {
      const categoryLower = category.toLowerCase().trim()
      const foundCat = cats.find(c => c.name.toLowerCase().trim() === categoryLower)
      const targetSlug = foundCat?.slug || categoryLower.replace(/\s+/g, '-')

      if (!result[targetSlug]) {
        result[targetSlug] = { title: category, slug: targetSlug, items: [], dynamic: true }
      }

      if (categoryLower === "cupcakes") {
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

            if (priceLabel.includes("pieces") || priceLabel.includes("pcs")) {
              const pieces = extractPieces(item.price_label) || extractPieces(item.item_name)
              if (pieces && pieces > 0 && !cupcakeBoxes.find((b) => b.pieces === pieces && b.item_name === item.item_name)) {
                cupcakeBoxes.push({ pieces, price, item_name: item.item_name })
              }
            } else if (item.subcategory && !processedItems.has(itemKey)) {
              const subcategoryKey = item.subcategory as keyof typeof cupcakeBySubcategory
              if (cupcakeBySubcategory[subcategoryKey]) {
                cupcakeBySubcategory[subcategoryKey].push({ name: item.item_name, price })
                processedItems.add(itemKey)
              }
            } else if (!item.subcategory && !processedItems.has(itemKey)) {
              cupcakeBySubcategory.Classic.push({ name: item.item_name, price })
              processedItems.add(itemKey)
            }
          })

        result[targetSlug].classic = cupcakeBySubcategory.Classic
        result[targetSlug].premium = cupcakeBySubcategory.Premium
        result[targetSlug].chocolate = cupcakeBySubcategory["Chocolate Specials"]
        result[targetSlug].boxes = cupcakeBoxes.sort((a, b) => a.pieces - b.pieces)
      } else if (categoryLower === "chocolates" || categoryLower === "liquor chocolates") {
        const chocolateByFlavour: Record<string, { price: number; boxes: any[] }> = {}

        items
          .filter((item) => item.category.toLowerCase().trim() === categoryLower)
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
              chocolateByFlavour[flavour].boxes.push({ pieces, price })
            }
          })

        result[targetSlug].flavours = Object.keys(chocolateByFlavour)
          .filter(flavour => chocolateByFlavour[flavour].price > 0)
          .map((flavour) => ({
            name: flavour,
            price: chocolateByFlavour[flavour].price,
            boxes: chocolateByFlavour[flavour].boxes.sort((a: any, b: any) => a.pieces - b.pieces),
          }))
      } else {
        // Standard grouping for Cakes, Jar Cakes, Cheesecake, Cakesicles, Popsicles, and all other categories
        Object.keys(grouped[category]).forEach((itemName) => {
          const rawPrices = grouped[category][itemName]
          const variants = rawPrices.map(p => ({
            label: p.price_label || "Standard",
            price: p.price
          }))

          // Sort variants logically
          variants.sort((a, b) => {
            const labelA = a.label.toLowerCase()
            const labelB = b.label.toLowerCase()

            // 1. Weight-based sorting (Half Pound < 1 Pound)
            const getWeightValue = (label: string) => {
              if (label.includes("half")) return 0.5
              if (label.includes("1 pound") || (label.includes("1") && label.includes("pound"))) return 1
              if (label.includes("1.5 pound")) return 1.5
              if (label.includes("2 pound")) return 2
              return null
            }

            const wa = getWeightValue(labelA)
            const wb = getWeightValue(labelB)
            if (wa !== null && wb !== null) return wa - wb
            if (wa !== null) return -1
            if (wb !== null) return 1

            // 2. Piece-based sorting (Smaller < Larger)
            const pa = extractPieces(labelA)
            const pb = extractPieces(labelB)
            if (pa !== null && pb !== null) return pa - pb
            if (pa !== null) return -1
            if (pb !== null) return 1

            // 3. Fallback to Price sorting
            return a.price - b.price
          })

          const itemData = {
            name: itemName,
            variants: variants
          }

          if (categoryLower === "cakes" && (itemName.toLowerCase().includes("dry fruit") || itemName.toLowerCase().includes("nut") || itemName.toLowerCase().includes("no maida"))) {
            result[targetSlug].special = itemData
          } else {
            result[targetSlug].items.push(itemData)
          }

          // Legacy fields for backward compatibility during transition
          if (categoryLower === "cakesicles" || categoryLower === "popsicles") {
            result[targetSlug].offer = variants[0]?.label || ""
            result[targetSlug].description = "All flavours available"
          }
        })
      }
    })

    return result
  }

  const menuData = useMemo(() => {
    if (!menuItems.length || !categories.length) return null
    return transformMenuData(menuItems, categories)
  }, [menuItems, categories])

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

  useEffect(() => {
    const categoryQuery = searchParams.get("category")
    if (categoryQuery && !loading && menuData) {
      const timer = setTimeout(() => {
        scrollToCategory(categoryQuery)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchParams, loading, menuData])

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
          <div className="flex gap-2 justify-center items-center">
            <div className="hidden sm:flex gap-2 justify-center overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.slug ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToCategory(cat.slug)}
                  className="whitespace-nowrap rounded-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="sm:hidden">
              <Select value={activeCategory ?? ""} onValueChange={(v) => scrollToCategory(v)}>
                <SelectTrigger className="w-40 h-8 text-sm">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-2">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-44 h-8 text-sm">
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="low-high">Price: Low to High</SelectItem>
                  <SelectItem value="high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <MenuSection data={menuData} sortOrder={sortOrder} />
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

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing Sweetness...</p>
        </div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  )
}
