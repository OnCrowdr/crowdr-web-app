import Image from "next/image"
import TechCabalLogo from "@/public/images/techcabal-logo.png"
import BusinessDayLogo from "@/public/images/businessday-logo.png"

const Press = () => {
  return (
    <div className="grid gap-[52px] px-[30px] mt-[40px] mb-[100px] md:pt-[80px] md:pb-[140px] place-items-center">
      <p className="font-medium text-xl md:text-[40px]">As seen in...</p>

      <div className="flex items-center gap-8 md:gap-16">
        <Image
          src={TechCabalLogo}
          alt="TechCabal Logo"
          className="w-[160px] md:w-[320px] md:h-[91px] object-contain"
          width={420}
          height={91}
        />
        <Image
          src={BusinessDayLogo}
          alt="Business Day Logo"
          className="w-[90px] md:w-[231px] md:h-[65px] object-contain"
          width={331}
          height={65}
        />
      </div>
    </div>
  )
}

export default Press
