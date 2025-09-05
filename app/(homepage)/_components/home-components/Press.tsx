import Image from "next/image"
import TechCabalLogo from "@/public/images/techcabal-logo.png"
import BusinessDayLogo from "@/public/images/businessday-logo.png"

const Press = () => {
  return (
    <div className="grid gap-[42px] px-[30px] pt-[80px] pb-[80px]">
      <p className="font-medium text-2xl">As seen in...</p>

      <div className="flex items-center gap-16">
        <Image
          src={TechCabalLogo}
          alt="TechCabal Logo"
          className="w-[320px] h-[91px] object-contain"
          width={420}
          height={91}
        />
        <Image
          src={BusinessDayLogo}
          alt="Business Day Logo"
          className="w-[231px] h-[65px] object-contain"
          width={331}
          height={65}
        />
      </div>
    </div>
  )
}

export default Press
