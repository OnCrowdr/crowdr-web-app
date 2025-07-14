import Image from "next/image"

import { RFC } from "@/types"
import DotsVertical from "@/public/svg/dots-vertical.svg"

const StatCard: RFC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="flex flex-col gap-6 font-semibold rounded-xl border border-[#EAECF0] w-[320px] p-6">
      <div className="flex justify-between">
        <p>{title}</p>

        <Image
          src={DotsVertical}
          alt=""
          className="relative left-1.5 bottom-1.5"
        />
      </div>

      <p className="text-4xl">{value}</p>
    </div>
  )
}

export default StatCard

type StatCardProps = {
  title: string
  value: number
}
