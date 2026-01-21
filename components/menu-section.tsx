"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

const CategoryIcon = ({
  category,
  flavor,
}: {
  category: string
  flavor?: string
}) => {
  const getColorForFlavor = (flavor?: string) => {
    const lowerFlavor = (flavor ?? "").toLowerCase()

    if (!lowerFlavor) return "from-muted to-muted"

    if (lowerFlavor.includes("vanilla")) return "from-[#FFF8E7] to-[#FFE4B5]"
    if (lowerFlavor.includes("pineapple")) return "from-[#FFF8DC] to-[#FFEAA7]"
    if (lowerFlavor.includes("strawberry")) return "from-[#FFE4E6] to-[#FECACA]"
    if (lowerFlavor.includes("orange")) return "from-[#FFEDD5] to-[#FED7AA]"
    if (lowerFlavor.includes("blueberry")) return "from-[#DBEAFE] to-[#BFDBFE]"
    if (lowerFlavor.includes("butterscotch")) return "from-[#FEF3C7] to-[#FDE68A]"
    if (lowerFlavor.includes("red velvet")) return "from-[#FECDD3] to-[#FDA4AF]"
    if (lowerFlavor.includes("forest")) return "from-[#FECACA] to-[#FCA5A5]"
    if (lowerFlavor.includes("kitkat")) return "from-[#FFEDD5] to-[#FDBA74]"
    if (lowerFlavor.includes("biscoff")) return "from-[#FED7AA] to-[#FDBA74]"
    if (lowerFlavor.includes("black currant")) return "from-[#E9D5FF] to-[#D8B4FE]"

    if (
      lowerFlavor.includes("chocolate") ||
      lowerFlavor.includes("dark") ||
      lowerFlavor.includes("milk") ||
      lowerFlavor.includes("white") ||
      lowerFlavor.includes("cocoa") ||
      lowerFlavor.includes("almond") ||
      lowerFlavor.includes("hazelnut") ||
      lowerFlavor.includes("dry fruit") ||
      lowerFlavor.includes("nut")
    ) {
      return "from-[#E7D4C0] to-[#C7A17A]"
    }

    return "from-[#E5E7EB] to-[#D1D5DB]"
  }

  const color = getColorForFlavor(flavor)

  // Cute cake slice icon - filled, rounded
  if (category === "cake") {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 19c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-6.5c0-.3-.1-.5-.3-.7l-8-6c-.4-.3-1-.3-1.4 0l-8 6c-.2.2-.3.4-.3.7V19z"
            fill="#C9A887"
          />
          <circle cx="12" cy="4" r="1.2" fill="#D4AF94" />
          <path d="M12 5.2V6" stroke="#D4AF94" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M3 20h18" stroke="#8B6F47" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  // Cute cupcake icon - filled, rounded, SAME for all cupcakes
  if (category === "cupcake") {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.5 11l1.3 7.5c.1.5.5.5.7.5h5c.3 0 .6 0 .7-.5L16.5 11H7.5z"
            fill="#E7C4A8"
            stroke="#B89A7D"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <ellipse cx="12" cy="8" rx="4.5" ry="3.5" fill="#F4D9C3" />
          <circle cx="10" cy="7" r="0.8" fill="#D4AF94" />
          <circle cx="14" cy="7" r="0.8" fill="#D4AF94" />
          <circle cx="12" cy="9" r="0.8" fill="#D4AF94" />
        </svg>
      </div>
    )
  }

  // Cute jar icon - filled, rounded, SAME for all jar cakes
  if (category === "jar" || category === "jar-cakes") {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="8" height="11" rx="1" fill="#E7C4A8" stroke="#B89A7D" strokeWidth="1" />
          <path d="M9 5h6c.5 0 1 .4 1 1v2H8V6c0-.6.5-1 1-1z" fill="#C9A887" stroke="#B89A7D" strokeWidth="1" />
          <rect x="8" y="8" width="8" height="1" fill="#B89A7D" />
          <path d="M10 11h4M10 13h4M10 15h4" stroke="#D4AF94" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  // Cute cheesecake slice icon - filled, rounded
  if (category === "cheesecake") {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 18l7-11 7 11H5z" fill="#F4E4D3" stroke="#B89A7D" strokeWidth="1" strokeLinejoin="round" />
          <path d="M5 18h14" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="9" r="1" fill="#E7C4A8" />
          <circle cx="10" cy="12" r="0.8" fill="#E7C4A8" />
          <circle cx="14" cy="12" r="0.8" fill="#E7C4A8" />
        </svg>
      </div>
    )
  }

  // Cute chocolate box icon - filled, rounded, SAME for regular chocolates
  if (category === "chocolate" || category === "chocolates") {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="7" width="12" height="11" rx="1.5" fill="#C9A887" stroke="#8B6F47" strokeWidth="1" />
          <path d="M12 7v11M6 12.5h12" stroke="#8B6F47" strokeWidth="1" />
          <circle cx="9" cy="9.5" r="0.8" fill="#E7C4A8" />
          <circle cx="15" cy="9.5" r="0.8" fill="#E7C4A8" />
          <circle cx="9" cy="15.5" r="0.8" fill="#E7C4A8" />
          <circle cx="15" cy="15.5" r="0.8" fill="#E7C4A8" />
        </svg>
      </div>
    )
  }

  // Cute liquor chocolate box - same as chocolate with a subtle dot
  if (category === "liquor" || category === "liquor-chocolates") {
    return (
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF94] to-[#B89A7D] flex items-center justify-center mb-2`}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="7" width="12" height="11" rx="1.5" fill="#A67C52" stroke="#8B6F47" strokeWidth="1" />
          <path d="M12 7v11M6 12.5h12" stroke="#8B6F47" strokeWidth="1" />
          <circle cx="9" cy="9.5" r="0.8" fill="#C9A887" />
          <circle cx="15" cy="9.5" r="0.8" fill="#C9A887" />
          <circle cx="9" cy="15.5" r="0.8" fill="#C9A887" />
          <circle cx="15" cy="15.5" r="0.8" fill="#C9A887" />
          <circle cx="16.5" cy="8.5" r="1.2" fill="#E7C4A8" />
        </svg>
      </div>
    )
  }

  // Cute cakesicle icon - rounded, on a stick
  if (category === "cakesicle" || category === "cakesicles") {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8.5" y="4" width="7" height="10" rx="2" fill="#E7C4A8" stroke="#B89A7D" strokeWidth="1" />
          <path d="M12 14v5.5" stroke="#C9A887" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 7c.5-.3 1.5-.5 3-.5s2.5.2 3 .5" stroke="#D4AF94" strokeWidth="1" strokeLinecap="round" />
          <circle cx="10.5" cy="9" r="0.6" fill="#F4D9C3" />
          <circle cx="13.5" cy="9" r="0.6" fill="#F4D9C3" />
        </svg>
      </div>
    )
  }

  // Cute popsicle icon - round cake pop style
  if (category === "popsicle" || category === "popsicles") {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="9" r="4.5" fill="#F4D9C3" stroke="#B89A7D" strokeWidth="1" />
          <path d="M12 13.5v6" stroke="#C9A887" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10.5" cy="8" r="0.7" fill="#E7C4A8" />
          <circle cx="13.5" cy="8" r="0.7" fill="#E7C4A8" />
          <path d="M10 10.5c.5.3 1.5.5 2 .5s1.5-.2 2-.5" stroke="#D4AF94" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  // Cute bento cake box icon
  if (category === "bento" || category.includes("bento")) {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="7" width="14" height="12" rx="2" fill="#E7C4A8" stroke="#B89A7D" strokeWidth="1" />
          <path d="M5 11h14" stroke="#B89A7D" strokeWidth="1" />
          <path d="M9 7v4M15 7v4" stroke="#B89A7D" strokeWidth="1" />
          <path d="M7 14c.5-.3 1.5-.5 2.5-.5s2 .2 2.5.5M13 14c.5-.3 1.5-.5 2.5-.5s2 .2 2.5.5" stroke="#D4AF94" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  // Generic fallback icon
  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" fill="#E7C4A8" stroke="#B89A7D" strokeWidth="1" />
        <path d="M12 22V12M20 7l-8 5M4 7l8 5" stroke="#B89A7D" strokeWidth="1" />
      </svg>
    </div>
  )
}

export function MenuSection({ data, sortOrder = "default" }: { data: any; sortOrder?: string }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [cupcakeState, setCupcakeState] = useState<Record<string, { mode: "piece" | "box" | null; boxSize: 4 | 8 | 12 | null }>>({})

  const [chocolateState, setChocolateState] = useState<Record<string, { mode: "piece" | "box" | null; boxSize: 6 | 9 | 12 | null }>>({})

  const [liquorChocolateState, setLiquorChocolateState] = useState<Record<string, { mode: "piece" | "box" | null; boxSize: 6 | 9 | 12 | null }>>({})

  // Safe fallbacks for nested `data` shape to avoid runtime/TS errors
  const safeCakes = {
    title: data?.cakes?.title ?? "",
    subtitle: data?.cakes?.subtitle ?? "",
    items: data?.cakes?.items ?? [],
    special: data?.cakes?.special ?? null,
  }

  const safeCupcakes = {
    title: data?.cupcakes?.title ?? "",
    classic: data?.cupcakes?.classic ?? [],
    premium: data?.cupcakes?.premium ?? [],
    chocolate: data?.cupcakes?.chocolate ?? [],
  }

  const safeJarCakes = {
    title: data?.["jar-cakes"]?.title ?? "",
    items: data?.["jar-cakes"]?.items ?? [],
  }

  const safeCheesecake = {
    title: data?.cheesecake?.title ?? "",
    items: data?.cheesecake?.items ?? [],
  }
  // normalize chocolate-like sources (flavours | varieties | items)
  const normalizeChocolateItems = (source: any) => {
    if (!source) return []

    if (Array.isArray(source.flavours) && source.flavours.length > 0) {
      return source.flavours
    }

    if (Array.isArray(source.varieties) && source.varieties.length > 0) {
      return source.varieties
    }

    if (Array.isArray(source.items) && source.items.length > 0) {
      return source.items
    }

    return []
  }

  // 🪄 TEMP MAGIC DATA (remove after DB fix)
  const fallbackLiquorItems = [
    { name: "Dark Rum", price: 80 },
    { name: "Vodka Almond", price: 90 },
    { name: "Whiskey Truffle", price: 95 },
  ]

  const safeChocolates = {
    title: data?.chocolates?.title ?? "Chocolates",
    flavours: normalizeChocolateItems(data?.chocolates),
  }

  const safeLiquor = {
    title: data?.["liquor-chocolates"]?.title ?? "Liquor Chocolates",
    flavours:
      normalizeChocolateItems(data?.["liquor-chocolates"]).length > 0
        ? normalizeChocolateItems(data?.["liquor-chocolates"])
        : fallbackLiquorItems,
  }


  const safeCakesicles = {
    title: data?.cakesicles?.title ?? "",
    description: data?.cakesicles?.description ?? "",
    items: data?.cakesicles?.items ?? [],
    offer: data?.cakesicles?.offer ?? "",
  }

  const safePopsicles = {
    title: data?.popsicles?.title ?? "",
    description: data?.popsicles?.description ?? "",
    items: data?.popsicles?.items ?? [],
    offer: data?.popsicles?.offer ?? "",
  }
  const handleAddToCart = (item: any, uniqueKey: string) => {
    addItem(item)

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
      duration: 3000,
    })

    setAddedItems((prev) => new Set(prev).add(uniqueKey))
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(uniqueKey)
        return newSet
      })
    }, 1500)
  }

  const getItemPrice = (item: any) => {
    if (!item) return Infinity

    // New variants structure
    if (Array.isArray(item.variants) && item.variants.length > 0) {
      const prices = item.variants.map((v: any) => v.price).filter((p: any) => typeof p === "number" && p > 0)
      return prices.length > 0 ? Math.min(...prices) : Infinity
    }

    // common price fields
    if (typeof item.price === "number" && item.price > 0) return item.price
    // cakes have halfPound / onePound
    if (typeof item.halfPound === "number" && item.halfPound > 0) return item.halfPound
    if (typeof item.onePound === "number" && item.onePound > 0) return item.onePound
    // boxes may have pieces+price - handle if price is present
    if (typeof item.pieces === "number" && typeof item.price === "number" && item.price > 0) return item.price
    return Infinity
  }

  const sortArrayByPrice = (arr: any[]) => {
    if (!arr || sortOrder === "default") return arr
    const copy = [...arr]
    copy.sort((a, b) => {
      const pa = getItemPrice(a)
      const pb = getItemPrice(b)
      return sortOrder === "low-high" ? pa - pb : pb - pa
    })
    return copy
  }

  const AddButton = ({ uniqueKey, onClick, className = "", children }: any) => (
    <Button
      size="sm"
      variant={addedItems.has(uniqueKey) ? "outline" : "default"}
      className={`rounded-full h-8 px-4 transition-all duration-300 ${addedItems.has(uniqueKey) ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100" : ""
        } ${className}`}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
    >
      {addedItems.has(uniqueKey) ? (
        <>
          <Check className="h-4 w-4 mr-1" /> Added
        </>
      ) : (
        children || (
          <>
            <Plus className="h-4 w-4 mr-1" /> Add
          </>
        )
      )}
    </Button>
  )

  const GenericItemCard = ({ item, category, slug, index }: { item: any, category: string, slug: string, index: number }) => {
    const uniqueKey = `${slug}-${index}`
    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <CategoryIcon category={slug} flavor={item.name} />
            <CardTitle className="font-semibold text-lg">{item.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(item.variants || []).map((variant: any, vIdx: number) => (
            <div key={vIdx} className="flex justify-between items-center py-1 first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">
                  {variant.label || "Standard"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium">₹{variant.price}</span>
                <AddButton
                  uniqueKey={`${uniqueKey}-${vIdx}`}
                  onClick={() => handleAddToCart({
                    name: `${item.name} (${variant.label || "Standard"})`,
                    price: variant.price,
                    category: category
                  }, `${uniqueKey}-${vIdx}`)}
                />
              </div>
            </div>
          ))}
          {/* If no variants but price exists (fallback) */}
          {!item.variants && item.price && (
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-primary">₹{item.price}</span>
              <AddButton
                uniqueKey={uniqueKey}
                onClick={() => handleAddToCart({
                  name: item.name,
                  price: item.price,
                  category: category
                }, uniqueKey)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const ChocolateCard = ({ item, categoryType, uniquePrefix }: { item: any; categoryType: "chocolates" | "liquorChocolates"; uniquePrefix: string }) => {
    const itemKey = `${uniquePrefix}-${item.name}`
    const isLiquor = categoryType === "liquorChocolates"
    const stateMap = isLiquor ? liquorChocolateState : chocolateState
    const setStateMap = isLiquor ? setLiquorChocolateState : setChocolateState

    const state = stateMap[itemKey] || { mode: null, boxSize: null }


    const handleModeSelect = (mode: "piece" | "box") => {
      setStateMap(prev => ({
        ...prev,
        [itemKey]: { mode, boxSize: null }
      }))
    }


    const handleBoxSizeSelect = (size: 6 | 9 | 12) => {
      setStateMap(prev => ({
        ...prev,
        [itemKey]: { mode: "box", boxSize: size }
      }))
    }



    const calculateBoxPrice = (boxSize: 6 | 9 | 12) => {
      const basePrice = item.price * boxSize
      let discount = 0
      if (boxSize === 6) {
        discount = 0.05
      } else if (boxSize === 9) {
        discount = 0.08
      } else if (boxSize === 12) {
        discount = 0.10
      }
      return Math.round(basePrice - (basePrice * discount))
    }

    const handleChocolateAdd = () => {
      let cartItem
      let uniqueKey

      if (state.mode === "piece") {
        cartItem = {
          name: `${item.name} Chocolate`,
          price: item.price,
          category: categoryType === "chocolates" ? "Chocolates" : "Liquor Chocolates",
        }
        uniqueKey = `${itemKey}-piece`
      } else if (state.mode === "box" && state.boxSize) {
        const finalPrice = calculateBoxPrice(state.boxSize as 6 | 9 | 12)
        cartItem = {
          name: `${item.name} ${categoryType === "chocolates" ? "Chocolates" : "Liquor Chocolates"} Box (${state.boxSize} pcs)`,
          price: finalPrice,
          category: categoryType === "chocolates" ? "Chocolates" : "Liquor Chocolates",
        }
        uniqueKey = `${itemKey}-box-${state.boxSize}`
      } else {
        return
      }

      addItem(cartItem)
      toast({
        title: "Added to cart",
        description: `${cartItem.name} has been added to your cart`,
        duration: 3000,
      })

      setAddedItems((prev) => new Set(prev).add(uniqueKey))
      setTimeout(() => {
        setAddedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(uniqueKey)
          return newSet
        })
      }, 1500)

      setStateMap(prev => ({
        ...prev,
        [itemKey]: { mode: null, boxSize: null }
      }))
    }

    const isAdded = addedItems.has(`${itemKey}-piece`) || addedItems.has(`${itemKey}-box-6`) || addedItems.has(`${itemKey}-box-9`) || addedItems.has(`${itemKey}-box-12`)

    return (
      <Card>
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          <CategoryIcon
            category={categoryType === "liquorChocolates" ? "liquor" : "chocolate"}
            flavor={item.name}
          />

          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">₹{item.price} per piece</p>

          {!state.mode ? (
            <div className="flex gap-2 w-full mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModeSelect("piece")}
                className="flex-1"
              >
                Per Piece
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModeSelect("box")}
                className="flex-1"
              >
                Box
              </Button>
            </div>
          ) : state.mode === "piece" ? (
            <div className="w-full mt-2 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStateMap(prev => ({ ...prev, [itemKey]: { mode: null, boxSize: null } }))}
                  className="flex-1"
                >
                  Back
                </Button>
                <AddButton
                  uniqueKey={`${itemKey}-piece`}
                  onClick={handleChocolateAdd}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </AddButton>
              </div>
            </div>
          ) : (
            <div className="w-full mt-2 space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-1">Box Discounts Available</p>
              <div className="flex gap-2">
                {[6, 9, 12].map((size) => {
                  const discount = size === 6 ? 5 : size === 9 ? 8 : 10
                  return (
                    <div key={size} className="flex-1 flex flex-col gap-1">
                      <Button
                        variant={state.boxSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleBoxSizeSelect(size as 6 | 9 | 12)}
                        className="w-full"
                      >
                        {size} pcs
                      </Button>
                      <span className="text-xs text-primary font-medium text-center">{discount}% OFF</span>
                    </div>
                  )
                })}
              </div>
              {state.boxSize && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    Total: ₹{calculateBoxPrice(state.boxSize as 6 | 9 | 12)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStateMap(prev => ({ ...prev, [itemKey]: { mode: null, boxSize: null } }))}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <AddButton
                      uniqueKey={`${itemKey}-box-${state.boxSize}`}
                      onClick={handleChocolateAdd}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </AddButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const CupcakeCard = ({ item, subcategory, uniquePrefix }: { item: any; subcategory: string; uniquePrefix: string }) => {
    const itemKey = `${uniquePrefix}-${item.name}`
    const state = cupcakeState[itemKey] || { mode: null, boxSize: null }

    const handleModeSelect = (mode: "piece" | "box") => {
      setCupcakeState(prev => ({
        ...prev,
        [itemKey]: { mode, boxSize: mode === "box" ? null : null }
      }))
    }

    const handleBoxSizeSelect = (size: 4 | 8 | 12) => {
      setCupcakeState(prev => ({
        ...prev,
        [itemKey]: { mode: "box", boxSize: size }
      }))
    }

    const calculateBoxPrice = (boxSize: 4 | 8 | 12) => {
      const basePrice = item.price * boxSize
      let discount = 0
      if (boxSize === 4) {
        discount = 0.05
      } else if (boxSize === 8) {
        discount = 0.08
      } else if (boxSize === 12) {
        discount = 0.10
      }
      return Math.round(basePrice - (basePrice * discount))
    }

    const handleChocolateAdd = () => {
      let cartItem
      let uniqueKey

      if (state.mode === "piece") {
        cartItem = {
          name: `${item.name} Cupcake`,
          price: item.price,
          category: "Cupcakes",
        }
        uniqueKey = `${itemKey}-piece`
      } else if (state.mode === "box" && state.boxSize) {
        const finalPrice = calculateBoxPrice(state.boxSize as 4 | 8 | 12)
        cartItem = {
          name: `${item.name} Cupcake Box (${state.boxSize} pcs)`,
          price: finalPrice,
          category: "Cupcakes",
        }
        uniqueKey = `${itemKey}-box-${state.boxSize}`
      } else {
        return
      }

      addItem(cartItem)
      toast({
        title: "Added to cart",
        description: `${cartItem.name} has been added to your cart`,
        duration: 3000,
      })

      setAddedItems((prev) => new Set(prev).add(uniqueKey))
      setTimeout(() => {
        setAddedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(uniqueKey)
          return newSet
        })
      }, 1500)

      setCupcakeState(prev => ({
        ...prev,
        [itemKey]: { mode: null, boxSize: null }
      }))
    }

    const isAdded = addedItems.has(`${itemKey}-piece`) || addedItems.has(`${itemKey}-box-4`) || addedItems.has(`${itemKey}-box-8`) || addedItems.has(`${itemKey}-box-12`)

    return (
      <Card>
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          <CategoryIcon category="cupcake" flavor={item.name} />
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">₹{item.price} per piece</p>

          {!state.mode ? (
            <div className="flex gap-2 w-full mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModeSelect("piece")}
                className="flex-1"
              >
                Per Piece
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModeSelect("box")}
                className="flex-1"
              >
                Box
              </Button>
            </div>
          ) : state.mode === "piece" ? (
            <div className="w-full mt-2 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCupcakeState(prev => ({ ...prev, [itemKey]: { mode: null, boxSize: null } }))}
                  className="flex-1"
                >
                  Back
                </Button>
                <AddButton
                  uniqueKey={`${itemKey}-piece`}
                  onClick={handleChocolateAdd}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </AddButton>
              </div>
            </div>
          ) : (
            <div className="w-full mt-2 space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-1">Box Discounts Available</p>
              <div className="flex gap-2">
                {[4, 8, 12].map((size) => {
                  const discount = size === 4 ? 5 : size === 8 ? 8 : 10
                  return (
                    <div key={size} className="flex-1 flex flex-col gap-1">
                      <Button
                        variant={state.boxSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleBoxSizeSelect(size as 4 | 8 | 12)}
                        className="w-full"
                      >
                        {size} pcs
                      </Button>
                      <span className="text-xs text-primary font-medium text-center">{discount}% OFF</span>
                    </div>
                  )
                })}
              </div>
              {state.boxSize && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    Total: ₹{calculateBoxPrice(state.boxSize as 4 | 8 | 12)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCupcakeState(prev => ({ ...prev, [itemKey]: { mode: null, boxSize: null } }))}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <AddButton
                      uniqueKey={`${itemKey}-box-${state.boxSize}`}
                      onClick={handleChocolateAdd}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </AddButton>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Cakes Section */}
      <section id="cakes">
        <h2 className="text-3xl font-bold mb-2 text-center">{safeCakes.title}</h2>
        <p className="text-center text-muted-foreground mb-8">{safeCakes.subtitle}</p>

        {/* 🚚 DELIVERY INFO BLOCK */}
        <div className="max-w-2xl mx-auto mb-10 p-4 rounded-xl bg-secondary/20 border border-secondary text-center space-y-2">
          <h3 className="font-semibold text-secondary-foreground">Delivery Information</h3>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              📍 <span>Within Rishra & nearby areas</span>
            </span>
            <span className="flex items-center gap-1.5">
              💰 <span>Free / Minimal delivery charges</span>
            </span>
            <span className="flex items-center gap-1.5">
              ⏰ <span>Same-day & Next-day available</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortArrayByPrice(safeCakes.items).map((item: any, index: number) => (
            <GenericItemCard
              key={`${item.name}-${index}`}
              item={item}
              category="Cakes"
              slug="cake"
              index={index}
            />
          ))}
        </div>

        {safeCakes.special && (
          <div className="mt-8">
            <GenericItemCard
              item={safeCakes.special}
              category="Cakes"
              slug="cake"
              index={999}
            />
          </div>
        )}
      </section>

      {/* Cupcakes Section */}
      <section id="cupcakes">
        <h2 className="text-3xl font-bold mb-8 text-center">{safeCupcakes.title}</h2>

        <div className="space-y-8">
          {safeCupcakes.classic && safeCupcakes.classic.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Classic Flavours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortArrayByPrice(safeCupcakes.classic).map((item: any, index: number) => (
                  <CupcakeCard key={`${item.name}-${index}`} item={item} subcategory="classic" uniquePrefix="cupcake-classic" />
                ))}
              </div>
            </div>
          )}

          {safeCupcakes.premium && safeCupcakes.premium.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Premium Flavours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortArrayByPrice(safeCupcakes.premium).map((item: any, index: number) => (
                  <CupcakeCard key={`${item.name}-${index}`} item={item} subcategory="premium" uniquePrefix="cupcake-premium" />
                ))}
              </div>
            </div>
          )}

          {safeCupcakes.chocolate && safeCupcakes.chocolate.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Chocolate Specials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortArrayByPrice(safeCupcakes.chocolate).map((item: any, index: number) => (
                  <CupcakeCard key={`${item.name}-${index}`} item={item} subcategory="chocolate" uniquePrefix="cupcake-chocolate" />
                ))}
              </div>
            </div>
          )}

        </div>

        <Card className="mt-6 bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Cupcake boxes available in 4 pcs / 8 pcs / 12 pcs. <span className="font-semibold text-primary">Save more on boxes!</span>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Jar Cakes Section */}
      <section id="jar-cakes">
        <h2 className="text-3xl font-bold mb-8 text-center">{safeJarCakes.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortArrayByPrice(safeJarCakes.items).map((item: any, index: number) => (
            <GenericItemCard
              key={`${item.name}-${index}`}
              item={item}
              category="Jar Cakes"
              slug="jar-cakes"
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Cheesecake Section */}
      <section id="cheesecake">
        <h2 className="text-3xl font-bold mb-8 text-center">{safeCheesecake.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {sortArrayByPrice(safeCheesecake.items).map((item: any, index: number) => (
            <GenericItemCard
              key={`${item.name}-${index}`}
              item={item}
              category="Cheesecake"
              slug="cheesecake"
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Chocolates Section */}
      <section id="chocolates">
        <h2 className="text-3xl font-bold mb-8 text-center">{safeChocolates.title}</h2>
        {safeChocolates.flavours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortArrayByPrice(safeChocolates.flavours).map((flavour: any, index: number) => (
              <ChocolateCard
                key={`${flavour.name}-${index}`}
                item={flavour}
                categoryType="chocolates"
                uniquePrefix="choc"
              />
            ))}

          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">No chocolate options available</p>
            </CardContent>
          </Card>
        )}
        {safeChocolates.flavours && safeChocolates.flavours.length > 0 && (
          <Card className="mt-6 bg-muted/30 max-w-2xl mx-auto">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Chocolate boxes available in 6 pcs / 9 pcs / 12 pcs. <span className="font-semibold text-primary">Save more on boxes!</span>
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Liquor Chocolates Section */}
      <section id="liquor-chocolates">
        <h2 className="text-3xl font-bold mb-8 text-center">{safeLiquor.title}</h2>
        {safeLiquor.flavours && safeLiquor.flavours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortArrayByPrice(safeLiquor.flavours).map((flavour: any, index: number) => (
              <ChocolateCard
                key={`${flavour.name}-${index}`}
                item={flavour}
                categoryType="liquorChocolates"
                uniquePrefix="liq"
              />
            ))}

          </div>
        ) : (
          <Card className="max-w-2xl mx-auto bg-accent/5 border-accent">
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">No liquor chocolate options available</p>
            </CardContent>
          </Card>
        )}
        {safeLiquor.flavours && safeLiquor.flavours.length > 0 && (
          <Card className="mt-6 bg-accent/5 border-accent max-w-2xl mx-auto">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Liquor chocolate boxes available in 6 pcs / 9 pcs / 12 pcs. <span className="font-semibold text-primary">Save more on boxes!</span>
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Cakesicles Section */}
      {safeCakesicles.items.length > 0 && (
        <section id="cakesicles">
          <h2 className="text-3xl font-bold mb-8 text-center">Cakesicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortArrayByPrice(safeCakesicles.items).map((item: any, index: number) => (
              <GenericItemCard
                key={`cakesicle-${index}`}
                item={item}
                category="Cakesicles"
                slug="cakesicles"
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popsicles Section */}
      {safePopsicles.items.length > 0 && (
        <section id="popsicles">
          <h2 className="text-3xl font-bold mb-8 text-center">Popsicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortArrayByPrice(safePopsicles.items).map((item: any, index: number) => (
              <GenericItemCard
                key={`popsicle-${index}`}
                item={item}
                category="Popsicles"
                slug="popsicles"
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Legacy Fallback if both empty */}
      {safeCakesicles.items.length === 0 && safePopsicles.items.length === 0 && (
        <section id="cakesicles-popsicles">
          <h2 className="text-3xl font-bold mb-8 text-center">Cakesicles & Popsicles</h2>
          <Card className="bg-primary/5 border-primary max-w-2xl mx-auto">
            <CardHeader className="pb-3 text-center">
              <div className="flex flex-col items-center gap-3">
                <CategoryIcon category="cakesicle" flavor="Cakesicle" />
                <CardTitle className="font-semibold">Cakesicles & Popsicles</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">All flavors available</span>
              <AddButton
                uniqueKey="cakesicles-legacy"
                onClick={() => handleAddToCart({ name: "Cakesicles (2 pcs)", price: 99, category: "Cakesicles" }, "cakesicles-legacy")}
              />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Dynamic / Generic Sections */}
      {Object.entries(data || {})
        .filter(([slug]) => ![
          'cakes',
          'cupcakes',
          'jar-cakes',
          'cheesecake',
          'chocolates',
          'liquor-chocolates',
          'cakesicles',
          'popsicles',
          'cakesicles-popsicles'
        ].includes(slug))
        .map(([slug, cat]: [string, any]) => (
          <section key={slug} id={slug} className="animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-8 text-center">{cat.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortArrayByPrice(cat.items || []).map((item: any, index: number) => (
                <GenericItemCard
                  key={`${slug}-${index}`}
                  item={item}
                  category={cat.title}
                  slug={slug}
                  index={index}
                />
              ))}
            </div>
          </section>
        ))}
    </>
  )
}
