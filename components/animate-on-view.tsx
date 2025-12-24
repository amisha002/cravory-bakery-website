"use client"

import { motion } from "framer-motion"
import { ReactNode, useState, useEffect } from "react"

interface AnimateOnViewProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimateOnView({ children, delay = 0, className = "" }: AnimateOnViewProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: isMobile ? 0.4 : 0.5,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

