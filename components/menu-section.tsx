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
  if (category === "jar") {
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
  if (category === "chocolate") {
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
  if (category === "liquor") {
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
  if (category === "cakesicle") {
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
  if (category === "popsicle") {
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

  return null
}

export function MenuSection({ data }: { data: any }) {
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
    title: data?.jarCakes?.title ?? "",
    items: data?.jarCakes?.items ?? [],
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
  title: data?.liquorChocolates?.title ?? "Liquor Chocolates",
  flavours:
    normalizeChocolateItems(data?.liquorChocolates).length > 0
      ? normalizeChocolateItems(data?.liquorChocolates)
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

  const AddButton = ({ uniqueKey, onClick, className = "", children }: any) => {
    const isAdded = addedItems.has(uniqueKey)
    return (
      <Button
        size="sm"
        onClick={onClick}
        className={`transition-all ${isAdded ? "bg-green-500 hover:bg-green-600" : ""} ${className}`}
        disabled={isAdded}
      >
        {isAdded ? (
          <>
            <Check className="h-4 w-4 mr-1" /> Added
          </>
        ) : (
          children || <Plus className="h-4 w-4" />
        )}
      </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeCakes.items.map((item: any, index: number) => (
            <Card key={`${item.name}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <CategoryIcon category="cake" flavor={item.name} />
                  <CardTitle className="font-semibold">{item.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Half Pound</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-medium">₹{item.halfPound}</span>
                    <AddButton
                      uniqueKey={`${item.name}-half`}
                      onClick={() =>
                        handleAddToCart(
                          {
                            ...item,
                            name: `${item.name} Cake (Half Pound)`,
                            price: item.halfPound,
                            category: "Cakes",
                          },
                          `${item.name}-half`,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">1 Pound</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-medium">₹{item.onePound}</span>
                    <AddButton
                      uniqueKey={`${item.name}-one`}
                      onClick={() =>
                        handleAddToCart(
                          {
                            ...item,
                            name: `${item.name} Cake (1 Pound)`,
                            price: item.onePound,
                            category: "Cakes",
                          },
                          `${item.name}-one`,
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {safeCakes.special && (
          <Card className="mt-8 bg-primary/5 border-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <CategoryIcon category="cake" flavor={safeCakes.special.name || "Dry Fruit"} />
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-primary">⭐</span> Special Cake
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-4">{safeCakes.special.name}</p>
              <div className="flex flex-col sm:flex-row gap-6">
                {safeCakes.special.halfPound > 0 && (
                  <div className="flex justify-between items-center flex-1">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Half Pound</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-medium">₹{safeCakes.special.halfPound}</span>
                      <AddButton
                        uniqueKey="special-half"
                        onClick={() =>
                          handleAddToCart(
                            {
                              name: `${safeCakes.special.name} (Half Pound)`,
                              price: safeCakes.special.halfPound,
                              category: "Cakes",
                            },
                            "special-half",
                          )
                        }
                      />
                    </div>
                  </div>
                )}
                {safeCakes.special.onePound > 0 && (
                  <div className="flex justify-between items-center flex-1">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">1 Pound</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-medium">₹{safeCakes.special.onePound}</span>
                      <AddButton
                        uniqueKey="special-one"
                        onClick={() =>
                          handleAddToCart(
                            {
                              name: `${safeCakes.special.name} (1 Pound)`,
                              price: safeCakes.special.onePound,
                              category: "Cakes",
                            },
                            "special-one",
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
                {safeCupcakes.classic.map((item: any, index: number) => (
                  <CupcakeCard key={`${item.name}-${index}`} item={item} subcategory="classic" uniquePrefix="cupcake-classic" />
                ))}
              </div>
            </div>
          )}

          {safeCupcakes.premium && safeCupcakes.premium.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Premium Flavours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {safeCupcakes.premium.map((item: any, index: number) => (
                  <CupcakeCard key={`${item.name}-${index}`} item={item} subcategory="premium" uniquePrefix="cupcake-premium" />
                ))}
              </div>
            </div>
          )}

          {safeCupcakes.chocolate && safeCupcakes.chocolate.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Chocolate Specials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {safeCupcakes.chocolate.map((item: any, index: number) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {safeJarCakes.items.map((item: any, index: number) => (
            <Card key={`${item.name}-${index}`}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <CategoryIcon category="jar" flavor={item.name} />
                <p className="font-semibold">{item.name}</p>
<p className="text-sm text-muted-foreground">₹{item.price}</p>

                <AddButton
                  uniqueKey={`jar-${item.name}`}
                  onClick={() =>
                    handleAddToCart(
                      {
                        ...item,
                        name: `${item.name} Jar Cake`,
                        category: "Jar Cakes",
                      },
                      `jar-${item.name}`,
                    )
                  }
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </AddButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Cheesecake Section */}
      <section id="cheesecake">
        <h2 className="text-3xl font-bold mb-8 text-center">{safeCheesecake.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {safeCheesecake.items.map((item: any, index: number) => (
            <Card key={`${item.name}-${index}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <CategoryIcon category="cheesecake" flavor={item.name} />
                <p className="font-semibold">{item.name}</p>
                <p className="text-muted-foreground font-medium">₹{item.price}</p>
                <AddButton
                  uniqueKey={`cheese-${item.name}`}
                  onClick={() =>
                    handleAddToCart(
                      {
                        ...item,
                        name: `${item.name} Cheesecake Slice`,
                        category: "Cheesecake",
                      },
                      `cheese-${item.name}`,
                    )
                  }
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </AddButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Chocolates Section */}
      <section id="chocolates">
        <h2 className="text-3xl font-bold mb-8 text-center">{safeChocolates.title}</h2>
        {safeChocolates.flavours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeChocolates.flavours.map((flavour: any, index: number) => (
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
            {safeLiquor.flavours.map((flavour: any, index: number) => (
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

      {/* Cakesicles & Popsicles Section */}
      <section id="cakesicles-popsicles" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CategoryIcon category="cakesicle" flavor="Cakesicle" />
              <CardTitle className="text-2xl">{safeCakesicles.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{safeCakesicles.description || "All flavours available"}</p>
            {safeCakesicles.items && safeCakesicles.items.length > 0 ? (
              <div className="space-y-3">
                {safeCakesicles.items.map((item: any, index: number) => (
                <div key={`${item.name}-${index}`} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      {item.price_label && <span className="text-sm text-muted-foreground ml-2">({item.price_label})</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-medium">₹{item.price}</span>


                      <AddButton
                        uniqueKey={`cakesicles-${index}`}
                        onClick={() =>
                          handleAddToCart(
                            {
                              name: `${item.name} ${item.price_label ? `(${item.price_label})` : ""}`,
                              price: item.price,
                              category: "Cakesicles",
                            },
                            `cakesicles-${index}`,
                          )
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </AddButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">
  {safeCakesicles.offer || "2 for ₹99"}
</span>
                <AddButton
                  uniqueKey="cakesicles"
                  onClick={() =>
                    handleAddToCart({ name: "Cakesicles (2 pcs)", price: 99, category: "Cakesicles" }, "cakesicles")
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </AddButton>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CategoryIcon category="popsicle" flavor="Popsicle" />
              <CardTitle className="text-2xl">{safePopsicles.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{safePopsicles.description || "All flavours available"}</p>
            {safePopsicles.items && safePopsicles.items.length > 0 ? (
              <div className="space-y-3">
                {safePopsicles.items.map((item: any, index: number) => (
                  <div key={`${item.name}-${index}`} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{item.name}</span>
                      {item.price_label && <span className="text-sm text-muted-foreground ml-2">({item.price_label})</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-medium">₹{item.price}</span>


                      <AddButton
                        uniqueKey={`popsicles-${index}`}
                        onClick={() =>
                          handleAddToCart(
                            {
                              name: `${item.name} ${item.price_label ? `(${item.price_label})` : ""}`,
                              price: item.price,
                              category: "Popsicles",
                            },
                            `popsicles-${index}`,
                          )
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </AddButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">{safePopsicles.offer || "3 for ₹99"}</span>
                <AddButton
                  uniqueKey="popsicles"
                  onClick={() =>
                    handleAddToCart({ name: "Popsicles (3 pcs)", price: 99, category: "Popsicles" }, "popsicles")
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </AddButton>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
