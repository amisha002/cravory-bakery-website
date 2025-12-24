"use client"

import { motion } from "framer-motion"
import { Heart, Cake, Camera } from "lucide-react"

export function DecorativeBackground() {
  const icons = [
    { Icon: Heart, initialX: "10%", initialY: "20%", duration: 8 },
    { Icon: Cake, initialX: "80%", initialY: "30%", duration: 10 },
    { Icon: Camera, initialX: "20%", initialY: "60%", duration: 12 },
    { Icon: Heart, initialX: "70%", initialY: "70%", duration: 9 },
    { Icon: Cake, initialX: "15%", initialY: "80%", duration: 11 },
    { Icon: Camera, initialX: "85%", initialY: "50%", duration: 7 },
  ]

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, initialX, initialY, duration }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: initialX,
            top: initialY,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.1, 0.12, 0.1, 0.1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        >
          <Icon className="w-20 h-20 text-primary/12 md:w-24 md:h-24" />
        </motion.div>
      ))}
    </div>
  )
}

