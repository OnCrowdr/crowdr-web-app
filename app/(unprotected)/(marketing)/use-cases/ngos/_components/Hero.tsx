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
        <div className="tag">For NGOs</div>
        <h1 className="content-header max-w-[642px]">
          The trusted fundraising platform for NGOs in Nigeria
        </h1>
        <p className="">
          Crowdr makes fundraising easy and helps you get noticed by donors
          looking to support causes like yours.
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
