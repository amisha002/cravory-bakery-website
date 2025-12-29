"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Reorder } from "framer-motion"
import Link from "next/link"
import {
  Trash2,
  Package,
  Image as ImageIcon,
  GripVertical,
  Check,
  X,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/lib/auth"

export const dynamic = "force-dynamic"

/* ================= AUTO SCROLL CONFIG ================= */

const EDGE_MARGIN = 120
const MAX_SCROLL_SPEED = 40

/* ================= TYPES ================= */

interface GalleryImage {
  id: string
  image_url: string
  image_path?: string
  category: string | null
  caption: string | null
  created_at: string
  order_index: number | null
}

/* ================= PAGE ================= */

export default function AdminGalleryUploadPage() {
  const { user, loading: authLoading } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()

  /* upload */
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formCategory, setFormCategory] = useState("")
  const [formCaption, setFormCaption] = useState("")
  const [uploading, setUploading] = useState(false)

  /* gallery */
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  /* caption */
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [savingCaption, setSavingCaption] = useState(false)

  /* reorder */
  const [reorderMode, setReorderMode] = useState(false)
  const [reorderItems, setReorderItems] = useState<GalleryImage[]>([])
  const [savingOrder, setSavingOrder] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  /* auto scroll refs */
  const pointerY = useRef<number | null>(null)
  const rafId = useRef<number | null>(null)

  /* ============ AUTH ============ */

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login")
  }, [authLoading, user, router])

  /* ============ AUTO SCROLL (DESKTOP + MOBILE) ============ */

  useEffect(() => {
    if (!isDragging) {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = null
      return
    }

    const step = () => {
      if (pointerY.current == null) {
        rafId.current = requestAnimationFrame(step)
        return
      }

      const y = pointerY.current
      const vh = window.innerHeight
      let speed = 0

      if (y < EDGE_MARGIN) {
        const p = (EDGE_MARGIN - y) / EDGE_MARGIN
        speed = -Math.ceil(p * MAX_SCROLL_SPEED)
      } else if (y > vh - EDGE_MARGIN) {
        const p = (y - (vh - EDGE_MARGIN)) / EDGE_MARGIN
        speed = Math.ceil(p * MAX_SCROLL_SPEED)
      }

      if (speed !== 0) {
        window.scrollBy({ top: speed, behavior: "auto" })
      }

      rafId.current = requestAnimationFrame(step)
    }

    rafId.current = requestAnimationFrame(step)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isDragging])

  useEffect(() => {
    if (!isDragging) return

    const onPointerMove = (e: PointerEvent) => {
      pointerY.current = e.clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      pointerY.current = e.touches[0]?.clientY ?? null
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("touchmove", onTouchMove, { passive: false })

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("touchmove", onTouchMove)
    }
  }, [isDragging])

  /* ============ FETCH ============ */

  const fetchImages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) {
      toast({ title: "Failed to load images", variant: "destructive" })
      setImages([])
    } else {
      setImages(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchImages()
  }, [user])

  /* ============ UPLOAD / DELETE / CAPTION / ORDER SAVE ============ */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setSelectedFile(f)
    const r = new FileReader()
    r.onloadend = () => setImagePreview(r.result as string)
    r.readAsDataURL(f)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    try {
      setUploading(true)
      const ext = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      await supabase.storage.from("gallery").upload(fileName, selectedFile)
      const { data } = supabase.storage.from("gallery").getPublicUrl(fileName)
      await supabase.from("gallery_images").insert([
        { image_url: data.publicUrl, image_path: fileName, category: formCategory || null, caption: formCaption || null },
      ])
      toast({ title: "Image uploaded" })
      setSelectedFile(null)
      setImagePreview(null)
      setFormCategory("")
      setFormCaption("")
      fetchImages()
    } catch {
      toast({ title: "Upload failed", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm("Delete this image?")) return
    try {
      if (img.image_path) await supabase.storage.from("gallery").remove([img.image_path])
      await supabase.from("gallery_images").delete().eq("id", img.id)
      toast({ title: "Image deleted" })
      fetchImages()
    } catch {
      toast({ title: "Delete failed", variant: "destructive" })
    }
  }

  const startEditCaption = (img: GalleryImage) => {
    setEditingId(img.id)
    setEditingValue(img.caption || "")
  }

  const saveCaption = async (img: GalleryImage) => {
    try {
      setSavingCaption(true)
      await supabase.from("gallery_images").update({ caption: editingValue.slice(0, 60) }).eq("id", img.id)
      setEditingId(null)
      setEditingValue("")
      fetchImages()
      toast({ title: "Caption updated" })
    } catch {
      toast({ title: "Caption save failed", variant: "destructive" })
    } finally {
      setSavingCaption(false)
    }
  }

  const saveOrder = async () => {
    try {
      setSavingOrder(true)
      for (let i = 0; i < reorderItems.length; i++) {
        await supabase.from("gallery_images").update({ order_index: i }).eq("id", reorderItems[i].id)
      }
      setReorderMode(false)
      setReorderItems([])
      fetchImages()
      toast({ title: "Order saved" })
    } catch {
      toast({ title: "Order save failed", variant: "destructive" })
    } finally {
      setSavingOrder(false)
    }
  }

  const filteredImages = selectedCategory === "All" ? images : images.filter((i) => i.category === selectedCategory)

  if (authLoading || !user) return null

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <Link href="/admin-menu">
            <Button variant="outline"><Package className="h-4 w-4 mr-2" /> Menu</Button>
          </Link>
          <Button variant="destructive" onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login") }}>
            Logout
          </Button>
        </div>

        {/* FILTER + REORDER */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {["All", "Birthday Cakes", "Anniversary Cakes", "Custom Cakes", "Cupcakes", "Chocolates", "Sweet Cravings"].map((c) => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-full text-sm ${selectedCategory === c ? "bg-primary text-white" : "bg-muted/20"}`}>
                {c}
              </button>
            ))}
          </div>

          {!reorderMode ? (
            <Button size="sm" onClick={() => { setReorderMode(true); setReorderItems(filteredImages) }}>
              Reorder
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" onClick={saveOrder} disabled={savingOrder}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => { setReorderMode(false); setReorderItems([]) }}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* GALLERY */}
        {reorderMode ? (
          <Reorder.Group
            axis="y"
            values={reorderItems}
            onReorder={setReorderItems}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="space-y-3"
          >
            {reorderItems.map((img) => (
              <Reorder.Item
                key={img.id}
                value={img}
                style={{ touchAction: "none" }}
                className="flex items-center gap-3 p-3 bg-background rounded-lg cursor-grab active:cursor-grabbing hover:bg-muted/40"
              >
                <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground" />
                <img src={img.image_url} className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded shrink-0" />
                <span className="truncate text-sm flex-1">{img.caption || "No caption"}</span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <Card key={img.id} className="relative group">
                <img src={img.image_url} className="h-36 sm:h-40 w-full object-cover" />
                <CardContent className="p-2 space-y-2">
                  {editingId === img.id ? (
                    <>
                      <input value={editingValue} onChange={(e) => setEditingValue(e.target.value.slice(0, 60))}
                        className="w-full border rounded px-2 py-1 text-sm" />
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => saveCaption(img)}><Check className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="h-3 w-3" /></Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm line-clamp-2">{img.caption || "No caption"}</p>
                      <Button size="sm" variant="outline" onClick={() => startEditCaption(img)}>Edit</Button>
                    </>
                  )}
                </CardContent>

                <Button size="icon" variant="destructive" onClick={() => handleDelete(img)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
