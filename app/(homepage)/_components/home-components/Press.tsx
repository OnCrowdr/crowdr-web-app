"use client"
import Image from "next/image"
import TechCabalLogo from "@/public/images/misc/techcabal-logo.png"
import BusinessDayLogo from "@/public/images/misc/businessday-logo.png"
import ThisDayLogo from "@/public/images/misc/thisday-logo.png"
import { useElementSize, useViewportSize } from "@mantine/hooks"
import Marquee from "@/components/Marquee"

const Press = () => {
  const { width: windowWidth } = useViewportSize()
  const { ref: titleElementRef, width: titleElementWidth } = useElementSize()
  const carouselOffset = Math.abs((windowWidth - titleElementWidth) / 2)

  return (
    <div
      className="relative h-[260px] sm:h-[248px]"
      style={{
        background: "url('/images/misc/newspaper-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-[#060606] opacity-90" />

      <div className="absolute inset-0 flex flex-col justify-center gap-6 md:gap-10 max-w-[1240px] mx-auto px-4">
        <p
          ref={titleElementRef}
          className="font-bold text-white text-center text-2xl sm:text-3xl md:text-[40px]"
        >
          As seen in...
        </p>

        <Marquee speed={30}>
          <div className="flex items-center gap-16 sm:gap-20 md:gap-24 mr-16 sm:mr-20 md:mr-24">
            <Image
              src={BusinessDayLogo}
              alt="Business Day Logo"
              className="w-[150px] sm:w-[220px] md:w-[350px] h-auto object-contain grayscale flex-shrink-0"
              width={390}
              height={72}
            />
            <Image
              src={TechCabalLogo}
              alt="TechCabal Logo"
              className="w-[130px] sm:w-[200px] md:w-[270px] h-auto object-contain grayscale flex-shrink-0"
              width={310}
              height={69}
            />
            <Image
              src={ThisDayLogo}
              alt="This Day Logo"
              className="w-[140px] sm:w-[220px] md:w-[320px] h-auto object-contain grayscale flex-shrink-0"
              width={310}
              height={69}
            />
          </div>
        </Marquee>

        {/* <div className="overflow-x-auto max-w-full scrollbar scrollbar-none md:mx-auto">
          <div className="flex items-center justify-center md:items-start md:justify-center">
            <div
              style={{ "--offset": `${carouselOffset}px` } as any}
              className="min-w-[20px] md:min-w-[calc(var(--offset)_+_20px)] lg:hidden"
            />
            <div className="self-center flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
              <Image
                src={BusinessDayLogo}
                alt="Business Day Logo"
                className="w-[160px] md:w-[350px] object-contain grayscale"
                width={390}
                height={72}
              />
              <Image
                src={TechCabalLogo}
                alt="TechCabal Logo"
                className="w-[160px] md:w-[270px] object-contain grayscale"
                width={310}
                height={69}
              />
              <Image
                src={ThisDayLogo}
                alt="This Day Logo"
                className="w-[160px] md:w-[320px] object-contain grayscale"
                width={310}
                height={69}
              />
            </div>
            <div
              style={{ "--offset": `${carouselOffset}px` } as any}
              className="min-w-[20px] md:min-w-[calc(var(--offset)_+_20px)] lg:hidden"
            />
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Press
