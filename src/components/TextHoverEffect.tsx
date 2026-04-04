"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export const TextHoverEffect = ({
  text,
  duration,
  size = 'text-7xl',
  fontFamily = 'helvetica',
}: {
  text: string
  duration?: number
  automatic?: boolean
  size?: string
  fontFamily?: string
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" })

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect()
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      })
    }
  }, [cursor])

  return (
    <svg
      aria-label={text}
      className="select-none"
      height="100%"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={e => setCursor({ x: e.clientX, y: e.clientY })}
      ref={svgRef}
      role="img"
      viewBox="0 0 180 40"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient cx="50%" cy="50%" gradientUnits="userSpaceOnUse" id="textGradient" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#7368ee" />
              <stop offset="25%" stopColor="#7f53ac" />
              <stop offset="50%" stopColor="#e64d99" />
              <stop offset="75%" stopColor="#ff6a88" />
              <stop offset="100%" stopColor="#ffd6e0" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          animate={maskPosition}
          gradientUnits="userSpaceOnUse"
          id="revealMask"
          initial={{ cx: "50%", cy: "50%" }}
          r="20%"
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect fill="url(#revealMask)" height="100%" width="100%" x="0" y="0" />
        </mask>
      </defs>
      <text
        className={`fill-transparent ${size} ${hovered ? "stroke-transparent" : "stroke-gray-400"}`}
        style={{ fontFamily }}
        dominantBaseline="middle"
        strokeWidth="0.3"
        textAnchor="middle"
        x="50%"
        y="50%"
        opacity={0.1}
      >
        {text}
      </text>
      <motion.text
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        className={`fill-transparent ${size} ${hovered ? "stroke-transparent" : "stroke-gray-400"}`}
        style={{ fontFamily }}
        dominantBaseline="middle"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        strokeWidth="0.3"
        textAnchor="middle"
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
        x="50%"
        y="50%"
        opacity={0.1}
      >
        {text}
      </motion.text>
      <text
        className={`fill-transparent ${size}`}
        style={{ fontFamily }}
        dominantBaseline="middle"
        mask="url(#textMask)"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        textAnchor="middle"
        x="50%"
        y="50%"
      >
        {text}
      </text>
    </svg>
  )
}

export default TextHoverEffect
