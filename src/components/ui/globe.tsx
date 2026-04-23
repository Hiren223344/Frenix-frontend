"use client"

import { useEffect, useRef } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.3, 0.3, 0.3] as [number, number, number],
  markerColor: [0.1, 0.8, 1] as [number, number, number],
  glowColor: [1, 1, 1] as [number, number, number],
  markers: [
    { location: [14.5995, 120.9842] as [number, number], size: 0.03 },
    { location: [19.076, 72.8777] as [number, number], size: 0.1 },
    { location: [23.8103, 90.4125] as [number, number], size: 0.05 },
    { location: [30.0444, 31.2357] as [number, number], size: 0.07 },
    { location: [39.9042, 116.4074] as [number, number], size: 0.08 },
    { location: [-23.5505, -46.6333] as [number, number], size: 0.1 },
    { location: [19.4326, -99.1332] as [number, number], size: 0.1 },
    { location: [40.7128, -74.006] as [number, number], size: 0.1 },
    { location: [34.6937, 135.5022] as [number, number], size: 0.05 },
    { location: [41.0082, 28.9784] as [number, number], size: 0.06 },
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    let width = 0

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2 || 1200,
      height: width * 2 || 1200,
      onRender: (state) => {
        if (!pointerInteracting.current) phiRef.current += 0.005
        state.phi = phiRef.current + rs.get()
        state.width = width * 2 || 1200
        state.height = width * 2 || 1200
      },
    })

    setTimeout(() => {
        if(canvasRef.current) canvasRef.current.style.opacity = "1"
    }, 0)
    
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
