import { RFC } from "@/types"
import React, { useRef, useEffect, useState } from "react"

const Marquee: RFC<Props> = ({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  gradient = true,
  gradientColor = "white",
  duplicate = true,
  className = "",
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateWidths = () => {
      if (contentRef.current && marqueeRef.current) {
        setContentWidth(contentRef.current.scrollWidth)
        setContainerWidth(marqueeRef.current.offsetWidth)
      }
    }

    updateWidths()
    window.addEventListener("resize", updateWidths)
    return () => window.removeEventListener("resize", updateWidths)
  }, [children])

  const animationDuration = duplicate
    ? contentWidth / speed
    : (contentWidth + containerWidth) / speed

  const gradientStyle = gradient
    ? {
        maskImage: `linear-gradient(to right, transparent, ${gradientColor} 10%, ${gradientColor} 90%, transparent)`,
        WebkitMaskImage: `linear-gradient(to right, transparent, ${gradientColor} 10%, ${gradientColor} 90%, transparent)`,
      }
    : {}

  const getAnimationName = () => {
    if (direction === "left") {
      return duplicate ? "marquee-left" : "marquee-left-single"
    } else {
      return duplicate ? "marquee-right" : "marquee-right-single"
    }
  }

  return (
    <div
      ref={marqueeRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      style={gradientStyle}
    >
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-left-single {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes marquee-right-single {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .pause-animation:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div
        ref={contentRef}
        className={`inline-block ${pauseOnHover ? "animate-marquee" : ""}`}
        style={{
          animation: `${getAnimationName()} ${animationDuration}s linear infinite`,
        }}
      >
        {children}
      </div>

      {duplicate && (
        <div
          className={`inline-block ${pauseOnHover ? "animate-marquee" : ""}`}
          style={{
            animation: `${getAnimationName()} ${animationDuration}s linear infinite`,
          }}
          aria-hidden="true"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default Marquee

interface Props {
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  gradient?: boolean
  gradientColor?: React.CSSProperties["backgroundColor"]
  duplicate?: boolean
  className?: string
}
