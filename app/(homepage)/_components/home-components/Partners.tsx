import React from "react"
import Image from "next/image"
import Marquee from "@/components/Marquee"

const Partners = () => {
  const logoUrls = [
    "/images/partners/aiesec.png",
    "/images/partners/beauty-hut.png",
    "/images/partners/black-girls-in-tech.png",
    "/images/partners/mairachamp.png",
    "/images/partners/bethesda.png",
    "/images/partners/lisa-academy.png",
    // "/svg/tokan.svg",
    // "/svg/foodbank.svg",
    // "/svg/lisa.png",
    // "/svg/orange-bath.svg",
  ]

  const partners = [
    "AIESEC",
    "Beauty Hut",
    "Black Girls in Tech",
    "Mairachamp",
    "Bethesda School for the Blind",
  ]

  return (
    <section className="partners relative">
      <div className="bg-[#1F2227] py-8 md:py-10 mt-10 md:mt-20">
        <div className="px-6 md:px-12 lg:px-16">
          <h2 className="text-[24px] sm:text-[32px] md:text-[42px] font-medium text-white ">
            Our Partners
          </h2>
        </div>
        <div className="scroll-container h-[120px] flex items-center">
          <Marquee>
            <div className="flex items-center">
              {logoUrls.map((logoUrl, index) => (
                <div key={index} className="w-[253px] flex justify-center items-center">
                  <div className="relative w-[200px] h-[60px]">
                    <Image
                      src={logoUrl}
                      alt={partners[index] || "Partner logo"}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
      <Image
        src="/svg/green-leaf.svg"
        width={48}
        height={48}
        alt="decorative-leaf"
        className="absolute bottom-0 right-0"
      />
    </section>
  )
}

export default Partners
