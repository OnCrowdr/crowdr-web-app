import { useState } from "react"

const Testimonials = () => {
  const [index, setIndex] = useState(0)
  const testimonial = testimonials[index]

  return (
    <section className="bg-[#DFFFE8] px-5 pt-20 pb-[118px]">
      <div className="grid gap-6 w-full max-w-[1053px] m-auto">
        <div className="grid place-items-center gap-2">
          <h3 className="font-medium text-[40px] text-[#393E46] leading-tight mx-auto">
            Testimonials
          </h3>
          <p className="text-[#393E46]">
            Read what people have to say about Crowdr
          </p>
        </div>

        <div
          className="rounded-[63px] bg-[#00B964] text-black border-2 border-black max-w-[1054px] pt-5 pb-7 px-[37px]"
          style={{ boxShadow: "0 10.558px 0 0 #111" }}
        >
          <div
            className="relative rounded-[54px] bg-[#DCFAE6] border-2 border-black pb-1.5"
            style={{ boxShadow: "0 10.558px 0 0 #111" }}
          >
            <div
              className="text-2xl pt-[43px] pb-[38px] px-[47px]"
              style={{
                background:
                  "url('/assets/rough-texture.png') lightgray 0% 0% / 179.48077917099px 179.48077917099px repeat",
              }}
            >
              {testimonial.quote}
            </div>

            <div
              className="grid place-items-center gap-1 rounded-full bg-[#FFCD2A] border-2 border-black py-4 px-10"
              style={{ boxShadow: "0 6.848px 0 0 #111" }}
            >
              <p className="font-bold text-[32px] uppercase tracking-[6.4px]">
                {testimonial.name}
              </p>
              <p className="text-[#475467]">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

const testimonials = [
  {
    quote:
      "“Working with Crowdr on the Mirabel Centre crowdfunding was amazing! They were hands-on and supportive every step of the way. From helping us spread the word and push out content to making sure we felt backed throughout the entire process. I’m so grateful for how invested you were in the cause. It truly felt like we were in it together.”",
    name: "OSHORIAME EGBAKUMEH",
    role: "Brand & Community Lead at BeautyHut Africa",
  },
  {
    quote: "fdfdf",
    name: "dfd",
    role: "fdfdf",
  },
  {
    quote: "fdfdf",
    name: "dfd",
    role: "fdfdf",
  },
]
