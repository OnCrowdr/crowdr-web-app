import React from "react"
import Image from "next/image"
import "@/app/(homepage)/_components/home-styles/header.css"
import { useRouter } from "next/navigation"
import { FaApplePay } from "react-icons/fa"

type Props = {
  openModal?: () => void
}

export default function Hero({ openModal }: Props) {
  const router = useRouter()
  return (
    <section className="cta">
      <div className="content">
        <div className="tag">For individuals</div>
        <h1 className="content-header max-w-[596px]">
          Crowdfunding that actually{" "}
          <span className="text-[#00B964]">works</span> in Nigeria
        </h1>
        <p className="">
          Whether it’s medical bills, school fees, or an emergency, Crowdr helps
          you raise funds from more people, build trust with donors, and get
          your money quickly.
        </p>
        <div className="button-group">
          <button className="btn-primary" onClick={() => router.push("signup")}>
            Start a Campaign
          </button>
        </div>
      </div>
      <Image
        src="/svg/crowdr-hero-section.svg"
        width={500}
        height={500}
        alt="hero-section"
        className="w-full
         -mt-[3rem] md:-mt-[16rem] 
         z-0"
      />
    </section>
  )
}
