"use client"
import { Member } from "@/api/_profile/models/GetProfile"
import { PLACEHOLDER_PROFILE_IMAGE } from "@/lib/constants"
import { RFC } from "@/types"

const MemberCard: RFC<Props> = ({ member }) => {
  return (
    <div className="grid justify-center gap-3">
      <div className="bg-gray-200 rounded aspect-square h-auto">
        <img
          src={member.image?.url ?? PLACEHOLDER_PROFILE_IMAGE}
          alt={member.fullname}
          className="w-full h-full rounded object-cover"
        />
      </div>

      <div className="grid justify-center text-center">
        <p className="font-semibold text-[#393E46]">{member.fullname}</p>
        <p className="text-xs text-[#667085]">{member.position}</p>
      </div>
    </div>
  )
}

export default MemberCard

interface Props {
  member: Member
}
