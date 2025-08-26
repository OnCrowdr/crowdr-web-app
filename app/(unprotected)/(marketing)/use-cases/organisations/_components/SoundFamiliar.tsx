import { CheckCircle, CheckCircle2 } from "lucide-react"

const SoundFamiliar = () => {
  return (
    <div className=" bg-[#181A1D] px-5 md:px-[96px] pt-20 pb-32">
      <div className="w-full max-w-[1220px] mx-auto">
        <h5 className="font-medium text-white text-[38px] md:text-[42px] mb-4">
          Does this sound familiar?
        </h5>
        <div className="grid gap-[18px]">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 md:gap-2.5">
              <CheckCircle2
                color="#912018"
                size={37}
                strokeWidth={3}
                className="h-7 aspect-[1] mt-1.5 md:mt-0 shrink-0"
              />
              <p className="font-medium text-white text-2xl md:text-[28px]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SoundFamiliar

const items = [
  "Finding the right causes is so difficult and takes too much time.",
  "Agencies cost too much and your team doesn’t have the expertise.",
  "You make donations, but can’t turn them into PR stories.",
]
