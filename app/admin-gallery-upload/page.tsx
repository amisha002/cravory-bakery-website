"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Package, Image as ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/lib/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface GalleryImage {
  id: string
  image_url: string
  image_path?: string
  category: string | null
  caption: string | null
  uploaded_by?: string
  created_at: string
}

export default function AdminGalleryUploadPage() {
  const { user, loading: authLoading } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({ category: "", caption: "" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/admin/login"
    }
  }, [authLoading, user])

  useEffect(() => {
    if (user) fetchImages()
  }, [user])

  const fetchImages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setImages(data || [])
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    try {
      setUploading(true)

      const ext = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("gallery").getPublicUrl(fileName)

      await supabase.from("gallery_images").insert([
        {
          image_url: data.publicUrl,
          image_path: fileName,
          category: formData.category || null,
          caption: formData.caption || null,
          uploaded_by: "admin",
        },
      ])

      toast({ title: "Image uploaded successfully" })

      setFormData({ category: "", caption: "" })
      setSelectedFile(null)
      setImagePreview(null)

      await fetchImages()
    } catch (err) {
      toast({ title: "Upload failed", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("Delete this image?")) return
    const { id, image_path } = image
    setDeletingId(id)

    try {
      if (!id) throw new Error("Missing image id")

      // Require explicit image_path for storage delete to avoid relying on public URLs
      if (!image_path) {
        console.error("Missing image_path for image:", image)
        throw new Error("Missing image_path; cannot delete storage file safely")
      }

      // Delete from storage using image_path
      const { error: storageError } = await supabase.storage.from("gallery").remove([image_path])
      if (storageError) {
        console.error("Storage delete failed:", storageError)
        throw storageError
      }

      // Delete DB row by id only
      const { data: deleteData, error: deleteError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id)
        .select()

      if (deleteError) {
        console.error("DB delete failed:", deleteError)
        throw deleteError
      }

      const deletedCount = Array.isArray(deleteData as any) ? (deleteData as any).length : (deleteData ? 1 : 0)
      if (deletedCount === 0) {
        console.error("No rows deleted for id:", id)
        throw new Error("No rows deleted from gallery_images")
      }

      // Re-fetch to ensure backend state is authoritative
      await fetchImages()

      toast({ title: "Image deleted successfully" })
    } catch (err) {
      console.error("Delete failed:", err)
      toast({ title: "Delete failed", description: "Failed to delete the image. Please try again.", variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage gallery images</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-4 mb-8 justify-between items-center">
          <div className="flex gap-4">
            <Link href="/admin-menu">
              <Button variant="outline"><Package className="h-4 w-4 mr-2" />Menu</Button>
            </Link>
            <Link href="/admin-gallery-upload">
              <Button><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button>
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
        <Card className="mb-16">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="file" accept="image/*" onChange={handleFileChange} required />

              {imagePreview && (
                <img src={imagePreview} className="h-48 object-cover rounded-md" />
              )}

              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Birthday Cakes">Birthday Cakes</SelectItem>
                  <SelectItem value="Anniversary Cakes">Anniversary Cakes</SelectItem>
                  <SelectItem value="Custom Cakes">Custom Cakes</SelectItem>
                  <SelectItem value="Cupcakes">Cupcakes</SelectItem>
                  <SelectItem value="Chocolates">Chocolates</SelectItem>
                  <SelectItem value="Sweet Cravings">Sweet Cravings</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <Textarea
                  placeholder="Caption (max 60 characters)"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value.slice(0, 60) })}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.caption.length}/60</p>
              </div>

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? "Uploading…" : "Upload Image"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-center">Loading images…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {images.map((img, i) => (
              <div key={img.id ?? i} className="relative group">
                <Card>
                  <img src={img.image_url} className="h-40 w-full object-cover" />
                  <CardContent className="p-2">
                    {img.caption && <p className="text-sm text-muted-foreground">{img.caption}</p>}
                  </CardContent>
                </Card>

                <Button
                  size="icon"
                  variant="destructive"
                  aria-label="Delete image"
                  onClick={() => handleDelete(img)}
                  disabled={deletingId === img.id}
                  className={
                    // Visible on small screens (mobile) by default, keep hover-reveal on larger screens
                    "absolute top-2 right-2 h-8 w-8 p-0 rounded-full transition-opacity duration-200 ease-out opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  }
                >
                  {deletingId === img.id ? (
                    <span className="text-xs">...</span>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
