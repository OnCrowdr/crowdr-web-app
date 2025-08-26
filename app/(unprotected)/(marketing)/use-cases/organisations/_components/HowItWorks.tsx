import React from "react"
import Image from "next/image"
import "@/app/(homepage)/_components/home-styles/todo.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { useRouter } from "next/navigation"
import useWindowSize from "@/hooks/useWindowSize"
import { CheckCircle2 } from "lucide-react"

const HowItWorks = () => {

  return (
    <div className=" bg-white px-5 md:px-[96px] pt-20 pb-32">
      <div className="w-full max-w-[1220px] mx-auto">
        <h5 className="font-medium text-black text-[38px] md:text-[42px] mb-4">
          How It Works
        </h5>
        <div className="grid gap-[18px]">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 md:gap-2.5">
              <CheckCircle2
                color="#079455"
                size={37}
                strokeWidth={3}
                className="h-7 aspect-[1] mt-1.5 md:mt-0 shrink-0"
              />
              <p className="font-medium text-black text-2xl md:text-[28px]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HowItWorks

const items = [
  "We sync to understand your goals, vision, and CSR pillars.",
  "We recommend a CSR budget based on your company stage.",
  "We build a structured plan for partnerships, donations, and events.",
  "We facilitate CSR projects throughout the chosen period.",
  "We track impact and secure media coverage for PR",
]
