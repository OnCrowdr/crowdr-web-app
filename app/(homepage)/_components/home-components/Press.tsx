import Image from "next/image"
import TechCabalLogo from "@/public/images/techcabal-logo.png"
import BusinessDayLogo from "@/public/images/businessday-logo.png"

const Press = () => {
  return (
    <div
      className="relative h-[248px]"
      style={{
        background: "url('/images/misc/newspaper-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-80" />

      {/*  mt-[40px] mb-[100px] md:pt-[80px] md:pb-[140px] */}
      <div className="absolute inset-0 flex flex-col justify-center gap-10 px-[30px] max-w-[1240px]">
        <p className="font-bold text-black text-xl md:text-[40px]">
          As seen in...
        </p>

        <div className="self-center flex items-center gap-8 md:gap-16">
          <Image
            src={BusinessDayLogo}
            alt="Business Day Logo"
            className="w-[90px] md:w-[350px] object-contain grayscale"
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
        </div>
      </div>
    </div>
  )
}

export default Press
