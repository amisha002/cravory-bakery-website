"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, ArrowLeft, Package, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useAdminAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Category {
    id: string
    name: string
    slug: string
    is_active: boolean
    order_index: number
}

export default function AdminMenuCategories() {
    const { user, loading: authLoading } = useAdminAuth()
    const router = useRouter()
    const { toast } = useToast()

    const [categories, setCategories] = useState<Category[]>([])
    const [name, setName] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/admin/login")
        }
    }, [authLoading, user, router])

    useEffect(() => {
        if (user) {
            fetchCategories()
        }
    }, [user])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from("menu_categories")
                .select("*")
                .order("order_index")

            if (error) throw error
            setCategories(data || [])
        } catch (err) {
            console.error("Error fetching categories:", err)
            toast({
                title: "Error",
                description: "Failed to load categories. Did you run the SQL migration?",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        try {
            setSubmitting(true)
            const slug = name.toLowerCase().replace(/\s+/g, "-")

            const { error } = await supabase.from("menu_categories").insert({
                name,
                slug,
                order_index: categories.length + 1
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Category added successfully",
            })

            setName("")
            fetchCategories()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to add category"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const deleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will NOT delete items but they will lose their category association.")) return

        try {
            const { error } = await supabase
                .from("menu_categories")
                .delete()
                .eq("id", id)

            if (error) throw error

            toast({
                title: "Success",
                description: "Category deleted",
            })
            fetchCategories()
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to delete category",
                variant: "destructive",
            })
        }
    }

    if (authLoading || (user && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/admin-menu">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Menu Items
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold">Manage Categories</h1>
                    <p className="text-muted-foreground">Control sections on your public menu</p>
                </div>

                <div className="mb-8 flex gap-4">
                    <Link href="/admin-menu">
                        <Button variant="outline" className="gap-2">
                            <Package className="h-4 w-4" />
                            Menu Items
                        </Button>
                    </Link>
                    <Link href="/admin-gallery-upload">
                        <Button variant="outline" className="gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Gallery
                        </Button>
                    </Link>
                </div>

                <Card className="mb-8">
                    <CardContent className="p-6">
                        <form onSubmit={addCategory} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category-name">New Category Name (e.g. Bento Cakes)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="category-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter category name"
                                        className="flex-1"
                                    />
                                    <Button type="submit" disabled={submitting || !name}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Section
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Active Menu Sections</h2>
                    {categories.length === 0 ? (
                        <p className="text-muted-foreground italic">No categories yet. Add one above.</p>
                    ) : (
                        <div className="grid gap-3">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex justify-between items-center border p-4 rounded-xl bg-card transition-shadow hover:shadow-md"
                                >
                                    <div>
                                        <span className="font-semibold text-lg">{cat.name}</span>
                                        <p className="text-xs text-muted-foreground">URL Slug: /{cat.slug}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteCategory(cat.id)}
                                            className="text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
