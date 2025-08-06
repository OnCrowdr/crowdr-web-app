"use client"
import React, { useState, useEffect } from "react"
import CampaignProgress from "../_components/CampaignProgress"
import OngoingCampaign from "../_components/OngoingCampaign"
import ActiveCampaign from "../_components/ActiveCampaigns"
import { useParams, usePathname } from "next/navigation"
import { useQuery } from "react-query"
import query from "../../../../api/query"
import _profile from "../../../../api/_profile"
import ProfileCard from "./_components/ProfileCard"
import useCampaignSummaryQuery from "../../../../api/query/useCampaignSummaryQuery"
import useCampaignsQuery from "../../../../api/query/useCampaignsQuery"
import {
  Campaign,
  IGetCampaignsResponseData,
  RunningStatus,
} from "../../../../api/_campaigns/models/GetCampaigns"
import { PLACEHOLDER_PROFILE_IMAGE } from "@/lib/constants"
import MemberCard from "./_components/MemberCard"
import MediaCard from "./_components/MediaCard"
import { cn } from "@/utils/style"
import { RFC, UserType } from "@/types"
import { useAuth } from "@/contexts/AppProvider"

const ProfilePage = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const { userId: passedUserId } = useParams() as { userId: string }
  const userId = passedUserId ?? user?._id ?? ""
  const [activeTab, setActiveTab] = useState<string>("Campaigns")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  )

  const profileQuery = useQuery({
    queryKey: [query.keys.PROFILE, userId],
    queryFn: () => _profile.getProfile({ userId }),
    enabled: !!userId
  })
  const profile = profileQuery.data

  const campaignStatsQuery = useCampaignSummaryQuery({
    params: { userId },
    enableQuery: !!userId,
  })

  const activeCampaignsQuery = useCampaignsQuery({
    params: { perPage: 1000000, runningStatus: RunningStatus.Active, userId },
    enableQuery: !!userId,
  })

  const previousCampaignsQuery = useCampaignsQuery({
    params: {
      perPage: 1000000,
      runningStatus: RunningStatus.Completed,
      userId,
    },
    enableQuery: !!userId,
  })

  useEffect(() => {
    const [ongoingCampaign] = activeCampaignsQuery.data?.campaigns ?? []
    if (ongoingCampaign) {
      setSelectedCampaign(ongoingCampaign)
    }
  }, [activeCampaignsQuery.data])

  // const fundingGoal = selectedCampaign?.fundraise
  // const amountDonated = selectedCampaign?.totalAmountDonated

  return (
    <div
      className={cn(
        !pathname.startsWith("/dashboard") && "max-w-[1140px] p-4 mx-auto py-10"
      )}
    >
      {/* Two-column layout for the entire page */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2">
          {/* Main card with cover photo and organization info */}
          {profileQuery.data ? (
            <ProfileCard profile={profileQuery.data} />
          ) : (
            <ProfileCard.Skeleton />
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfilePage

interface TabProps {
  label: string
  isActive: boolean
  onClick: () => void
}

// Tab Component
const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm ${
        isActive
          ? "bg-white text-primary border border-primary"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  )
}

// ProfileCard.Skeleton = () => {
//   return (
//     <div className="animate-pulse max-w-7xl mx-auto py-8">
//       {/* Two-column layout for the entire page */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left column (2/3) */}
//         <div className="lg:col-span-2">
//           {/* Main card with cover photo and organization info */}
//           <div className="rounded-xl overflow-hidden border border-gray-100 mb-8">
//             {/* Cover photo with logo */}
//             <div className="relative h-64 w-full bg-gray-200"></div>

//             {/* Profile section */}
//             <div className="p-6">
//               <div className="flexspace-x-4 flex gap-x-4">
//                 <div className="size-16 h-16 w-16 rounded-full bg-gray-200"></div>
//                 <div className="flex-1 space-y-6 py-1 max-w-[200px]">
//                   <div className="space-y-3">
//                     <div className="h-2 rounded bg-gray-200"></div>
//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="col-span-2 h-2 rounded bg-gray-200"></div>
//                       <div className="col-span-1 h-2 rounded bg-gray-200"></div>
//                     </div>
//                     <div className="h-2 rounded bg-gray-200 max-w-[100px]"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Bio section */}
//               <div className="mt-8 space-y-3">
//                 <div className="h-2 rounded bg-gray-200"></div>
//                 <div className="h-2 rounded bg-gray-200"></div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="col-span-2 h-2 rounded bg-gray-200"></div>
//                   <div className="col-span-1 h-2 rounded bg-gray-200"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right column (1/3) - Ongoing Campaign */}
//         <div className="lg:col-span-1 h-full">
//           <div className="mt-8">
//             <div className="flex flex-row items-start justify-between mb-4">
//               <div className="flex-1 h-2.5 rounded bg-gray-200 max-w-[150px]"></div>
//               <div className="flex-1 h-2 rounded bg-gray-200 max-w-[100px]"></div>
//             </div>

//             <div className="flex flex-col gap-5 mb-8">
//               {Array.from({ length: 4 }).map((item, index) => (
//                 <div key={index} className="flex gap-x-4">
//                   <div className="size-10 h-10 w-10 rounded-full bg-gray-200"></div>
//                   <div className="flex flex-col flex-1 space-y-3 py-1 max-w-[200px]">
//                     <div className="h-2 rounded bg-gray-200 max-w-[100px]"></div>
//                     <div className="h-2 rounded bg-gray-200"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
