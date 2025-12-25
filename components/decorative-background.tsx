"use client"

import { motion } from "framer-motion"
import { Heart, Cake, Camera } from "lucide-react"

export function DecorativeBackground() {
  const icons = [
    { Icon: Heart, x: "10%", y: "20%", duration: 14 },
    { Icon: Cake, x: "80%", y: "30%", duration: 18 },
    { Icon: Camera, x: "20%", y: "60%", duration: 22 },
    { Icon: Heart, x: "70%", y: "70%", duration: 16 },
    { Icon: Cake, x: "15%", y: "80%", duration: 20 },
    { Icon: Camera, x: "85%", y: "50%", duration: 15 },
  ]

  const blobs = [
    { x: "5%", y: "15%", size: "w-48 h-48", duration: 30 },
    { x: "75%", y: "65%", size: "w-64 h-64", duration: 40 },
    { x: "50%", y: "10%", size: "w-40 h-40", duration: 35 },
  ]

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* BLOBS */}
      {blobs.map((b, i) => (
        <motion.div
          key={`blob-${i}`}
          className={`absolute rounded-full blur-3xl ${b.size}`}
          style={{
            left: b.x,
            top: b.y,
            background:
              i === 0
                ? "rgba(250,204,168,0.18)"
                : i === 1
                ? "rgba(244,180,203,0.18)"
                : "rgba(232,219,177,0.18)",
          }}
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ICONS */}
      {icons.map(({ Icon, x, y, duration }, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-20 h-20 md:w-24 md:h-24 text-primary/15" />
        </motion.div>
      ))}
    </div>
  )
}
