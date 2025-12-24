"use client"

import { supabase } from "./supabase"
import { useEffect, useState } from "react"

export function useAdminAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        const res = await supabase.auth.getSession()
        const session = (res as any)?.data?.session
        if (mounted) setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error checking auth:", error)
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      // unsubscribe safely
      try {
        ;(listener as any)?.subscription?.unsubscribe?.()
      } catch (e) {
        // ignore
      }
    }
  }, [])

  return { user, loading }
}

