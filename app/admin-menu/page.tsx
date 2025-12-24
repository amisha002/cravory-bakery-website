"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit2, Package, Image as ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/lib/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface MenuItem {
  id: string
  category: string
  subcategory: string | null
  item_name: string
  price_label: string
  price: number
  created_at: string
}

const CATEGORIES = [
  "Cakes",
  "Cupcakes",
  "Jar Cakes",
  "Cheesecake",
  "Chocolates",
  "Liquor Chocolates",
  "Cakesicles",
  "Popsicles",
]

const PRICE_LABELS = [
  "Half Pound",
  "1 Pound",
  "Slice",
  "Per Piece",
  "Price",
  "4 pcs",
  "6 pcs",
  "8 pcs",
  "9 pcs",
  "12 pcs",
]

const CUPCAKE_SUBCATEGORIES = [
  "Classic",
  "Premium",
  "Chocolate Specials",
]

export default function AdminMenuPage() {
  const { user, loading: authLoading } = useAdminAuth()
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filterCategory, setFilterCategory] = useState<string>("All")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    item_name: "",
    price_label: "",
    price: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/admin/login"
    }
  }, [authLoading, user])

  useEffect(() => {
    if (user) {
      fetchMenuItems()
    }
  }, [user])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category", { ascending: true })
        .order("item_name", { ascending: true })

      if (error) throw error
      setMenuItems(data || [])
    } catch (err) {
      console.error("Error fetching menu items:", err)
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.item_name || !formData.price_label || !formData.price) {
      toast({
        title: "Please complete all fields",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    if (formData.category === "Cupcakes" && !formData.subcategory) {
      toast({
        title: "Subcategory required",
        description: "Please select a subcategory for cupcakes",
        variant: "destructive",
      })
      return
    }

    const priceNumber = parseFloat(formData.price)
    if (isNaN(priceNumber) || priceNumber < 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      if (editingId) {
        const { error } = await supabase
          .from("menu_items")
          .update({
            category: formData.category,
            subcategory: formData.category === "Cupcakes" ? formData.subcategory : null,
            item_name: formData.item_name,
            price_label: formData.price_label,
            price: Math.round(priceNumber),
          })
          .eq("id", editingId)

        if (error) throw error

        toast({
          title: "Success!",
          description: "Menu item updated successfully",
        })
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert([
            {
              category: formData.category,
              subcategory: formData.category === "Cupcakes" ? formData.subcategory : null,
              item_name: formData.item_name,
              price_label: formData.price_label,
              price: Math.round(priceNumber),
            },
          ])

        if (error) throw error

        toast({
          title: "Success!",
          description: "Menu item added successfully",
        })
      }

      setFormData({ category: "", subcategory: "", item_name: "", price_label: "", price: "" })
      setEditingId(null)
      await fetchMenuItems()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save menu item"
      console.error("Menu item save error:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setFormData({
      category: item.category,
      subcategory: item.subcategory || "",
      item_name: item.item_name,
      price_label: item.price_label,
      price: item.price.toString(),
    })
    setEditingId(item.id)
    setTimeout(() => {
      const formElement = document.getElementById("admin-form")
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const handleCancelEdit = () => {
    setFormData({ category: "", subcategory: "", item_name: "", price_label: "", price: "" })
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return
    }

    try {
      setDeletingId(id)

      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success!",
        description: "Menu item deleted successfully",
      })

      await fetchMenuItems()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete menu item"
      console.error("Delete error:", err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage menu items and gallery</p>
        </div>

        <div className="mb-8 flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Link href="/admin-menu">
              <Button variant="default" className="gap-2">
                <Package className="h-4 w-4" />
                Menu
              </Button>
            </Link>
            <Link href="/admin-gallery-upload">
              <Button variant="outline" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Gallery
              </Button>
            </Link>
          </div>
          <Button
            variant="destructive"
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/admin/login")
            }}
          >
            Logout
          </Button>
        </div>
            <Card className="mb-8" id="admin-form">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Menu Item" : "Add New Menu Item"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: "" })}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.category === "Cupcakes" && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                    >
                      <SelectTrigger id="subcategory" className="w-full">
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUPCAKE_SUBCATEGORIES.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="item_name">Item Name *</Label>
                  <Input
                    id="item_name"
                    value={formData.item_name}
                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_label">Price Label *</Label>
                  <Select
                    value={formData.price_label}
                    onValueChange={(value) => setFormData({ ...formData, price_label: value })}
                  >
                    <SelectTrigger id="price_label" className="w-full">
                      <SelectValue placeholder="Select Price Label" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_LABELS.map((label) => (
                        <SelectItem key={label} value={label}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? "Saving..." : editingId ? "Update" : "Add"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Existing Menu Items</h2>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading menu items...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu items yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {menuItems
                .filter((item) => filterCategory === "All" || item.category === filterCategory)
                .map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-lg">{item.item_name}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {item.category}
                          </span>
                          {item.subcategory && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {item.subcategory}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.price_label}: ₹{item.price}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          disabled={deletingId === item.id || editingId === item.id}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id || editingId === item.id}
                        >
                          {deletingId === item.id ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

