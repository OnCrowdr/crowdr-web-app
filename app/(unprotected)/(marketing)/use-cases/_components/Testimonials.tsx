import { cn } from "@/lib/utils"
import { RFC } from "@/types"
import { use, useEffect, useRef, useState } from "react"

const Testimonials: RFC<Props> = ({ testimonials }) => {
  const [index, setIndex] = useState(0)
  const testimonial = testimonials[index]
  const intervalRef = useRef<NodeJS.Timer | null>(null)

  useEffect(() => {
    startLoop()
    return stopLoop
  }, [])

  const nextTestimonial = () => {
    stopLoop()
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    startLoop()
  }

  const startLoop = () => {
    intervalRef.current = setInterval(() => {
      nextTestimonial()
    }, 10000) // Change testimonial every 10 seconds
  }

  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  return (
    <section className="bg-[#DFFFE8] px-5 pt-20 pb-[30px]">
      <div className="grid gap-6 w-full max-w-[1053px] m-auto">
        <div className="grid place-items-center gap-2">
          <h3 className="font-medium text-[40px] text-[#101828] leading-tight mx-auto">
            Testimonials
          </h3>
          <p className="text-[#475467]">
            Read what people have to say about Crowdr
          </p>
        </div>

        <div
          className="rounded-[63px] bg-[#00B964] text-black border-2 border-black max-w-[1054px] pt-5 pb-7 px-5 md:px-[37px] mb-[110px]"
          style={{ boxShadow: "0 10.558px 0 0 #111" }}
        >
          <div
            className="relative rounded-[54px] bg-[#DCFAE6] border-2 border-black pb-1.5"
            style={{ boxShadow: "0 10.558px 0 0 #111" }}
          >
            <div className="relative text-lg md:text-2xl text-black text-center rounded-[54px] pt-7 md:pt-[43px] pb-5 md:pb-[38px] px-5 md:px-[47px]">
              <div
                className="absolute inset-0 opacity-10 rounded-[54px] pt-[43px] pb-[38px] px-[47px]"
                style={{
                  background:
                    "url('/assets/rough-texture.png') lightgray 0% 0% / 179.48077917099px 179.48077917099px repeat",
                }}
              />

              {testimonial.quote}
            </div>

            <div
              className="absolute translate-y-[100%] -bottom-[9px] left-[50%] -translate-x-[50%] grid place-items-center gap-1 rounded-full bg-[#FFCD2A] border-2 border-black max-w-max py-4 px-7 md:px-[84px]"
              style={{ boxShadow: "0 6.848px 0 0 #111" }}
            >
              <p className="font-bold text-center text-black text-xl md:text-[32px] uppercase tracking-[6.4px]">
                {testimonial.name}
              </p>
              {testimonial.role && (
                <p className="text-sm md:text-base text-center text-[#475467]">
                  {testimonial.role}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={nextTestimonial}
          className="flex items-center justify-center w-[95px] aspect-[1] border border-black rounded-full bg-[#00B964] hover:bg-[#009e54] transition-colors ml-auto mb-[30px]"
          style={{ boxShadow: "3px 4px 0 0 #111" }}
        >
          <IconArrowRight />
        </button>

        <div className="flex gap-1 justify-center">
          {Array.from({ length: testimonials.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "flex-[0_0_32px] w-3 h-3 md:w-4 md:h-4 rounded-full border-black",
                i === index
                  ? "border bg-[#3B8249]"
                  : "bg-[#4DAF90] border-[0.2px]"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

interface Props {
  testimonials: Array<{
    quote: string
    name: string
    role?: string
  }>
}

const IconArrowRight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="28"
      viewBox="0 0 52 28"
      fill="none"
    >
      <path
        d="M2 13.9434L49.7732 13.9434M49.7732 13.9434C41.4129 11.0998 37.8299 7.68742 36.0384 2.00014M49.7732 13.9434C41.4129 16.7871 37.8299 20.1994 36.0384 25.8867"
        stroke="white"
        stroke-width="3.21"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
