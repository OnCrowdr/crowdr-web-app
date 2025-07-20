"use client"
import React, { useState, useEffect } from "react"
import CampaignProgress from "../../../(protected)/dashboard/_components/CampaignProgress"
import OngoingCampaign from "../../../(protected)/dashboard/_components/OngoingCampaign"
import ActiveCampaign from "../../../(protected)/dashboard/_components/ActiveCampaigns"
import { useParams } from "next/navigation"
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

const OrganizationProfilePage: React.FC = () => {
  const { userId } = useParams() as { userId: string }
  const [activeTab, setActiveTab] = useState<string>("Campaigns")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  )

  const profileQuery = useQuery({
    queryKey: [query.keys.PROFILE, userId],
    queryFn: () => _profile.getProfile({ userId }),
  })
  const profile = profileQuery.data

  const campaignStatsQuery = useCampaignSummaryQuery({
    params: { userId },
  })

  const activeCampaignsQuery = useCampaignsQuery({
    params: { perPage: 1000000, runningStatus: RunningStatus.Active, userId },
  })

  const previousCampaignsQuery = useCampaignsQuery({
    params: {
      perPage: 1000000,
      runningStatus: RunningStatus.Completed,
      userId,
    },
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
    <div className="max-w-[1140px] p-4 mx-auto py-10">
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

          {/* Campaign stats */}
          {campaignStatsQuery.data && (
            <CampaignProgress stats={campaignStatsQuery.data} />
          )}

          {profile && (
            <>
              {/* Tabs */}
              <div className="mt-8 mb-6 flex space-x-2">
                <Tab
                  label="Campaigns"
                  isActive={activeTab === "Campaigns"}
                  onClick={() => setActiveTab("Campaigns")}
                />
                <Tab
                  label="Media"
                  isActive={activeTab === "Media"}
                  onClick={() => setActiveTab("Media")}
                />
                <Tab
                  label="Members"
                  isActive={activeTab === "Members"}
                  onClick={() => setActiveTab("Members")}
                />
              </div>

              {/* Tab Content */}
              {activeTab === "Campaigns" && (
                <>
                  {/* Active campaigns */}

                  <div className="mb-10">
                    <h2 className="text-lg font-semibold mb-2">
                      Active Campaigns
                    </h2>

                    {activeCampaignsQuery.data ? (
                      activeCampaignsQuery.data.pagination.total !== 0 ? (
                        <>
                          <p className="text-gray-600 mb-4">
                            View all present and active campaigns of{" "}
                            {profile.user.userType === "individual"
                              ? profile.user.fullName
                              : profile.user.organizationName}{" "}
                            and feel free to donate.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeCampaignsQuery.data.campaigns.map(
                              (campaign) => (
                                <ActiveCampaign
                                  key={campaign._id}
                                  campaign={campaign}
                                />
                              )
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600 italic">
                          No active campaigns
                        </p>
                      )
                    ) : (
                      <p className="text-gray-600 italic">Loading</p>
                    )}
                  </div>

                  <div className="mb-10">
                    <h2 className="text-lg font-semibold mb-2">
                      Previous Campaigns
                    </h2>

                    {previousCampaignsQuery.data ? (
                      previousCampaignsQuery.data.pagination.total !== 0 ? (
                        <>
                          <p className="text-gray-600 mb-4">
                            These campaigns were successfully completed thanks
                            to people like you.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {previousCampaignsQuery.data.campaigns.map(
                              (campaign) => (
                                <ActiveCampaign
                                  key={campaign._id}
                                  campaign={campaign}
                                />
                              )
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600 italic">
                          No previous campaigns
                        </p>
                      )
                    ) : (
                      <p className="text-gray-600 italic">Loading...</p>
                    )}
                  </div>
                </>
              )}

              {activeTab === "Media" && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Outreaches/Campaign Media
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Here are images to show every penny is being used
                    effectively
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {profile.engagements.map((engagement) => (
                      <div
                        key={engagement._id}
                        className="bg-gray-200 rounded aspect-square h-auto"
                      >
                        <img
                          src={engagement.url}
                          alt=""
                          className="w-full h-full rounded object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Members" && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Team Members</h3>
                  <p className="text-gray-600">
                    No team members information available at this time.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right column (1/3) - Ongoing Campaign */}
        <div className="lg:col-span-1 max-h-fit border border-[#0000001A] rounded-[20px] px-[22px] py-6">
          <p className="font-semibold text-xl text-[#00B964]">
            Ongoing Campaign
          </p>
          {selectedCampaign && (
            <OngoingCampaign
              campaign={selectedCampaign}
              // onDonate={handleDonate}
            />
          )}

          {/* Donors list */}
          {/* {selectedCampaign && (
            <RecentDonors
              donors={donorsData}
              totalDonors={32}
              campaignId={selectedCampaign._id}
            />
          )} */}

          {/* No active campaign */}
          {!selectedCampaign && (
            <p className="text-xs text-[#667085]">No active campaign</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrganizationProfilePage

// Types
interface OrganizationProfile {
  id: string
  name: string
  type: string
  logo: string
  coverImage: string
  bio: string
  isVerified: boolean
  profileLink: string
  stats: {
    totalRaised: number
    totalRaisedFormatted: string
    livesImpacted: number
    activeCampaigns: number
    totalCampaigns: number
    currency: string
  }
  socials: {
    email?: string
    instagram?: string
    twitter?: string
  }
}

// interface Campaign {
//   id: string
//   title: string
//   image: string
//   category: string
//   description: string
//   goal: {
//     amount: number
//     raised: number
//     currency: string
//   }
//   donationCount: number
//   percentComplete: number
//   status: "active" | "completed" | "ongoing"
// }

interface Donor {
  id: string
  name: string
  amount: number
  currency: string
  timeAgo: string
  isAnonymous: boolean
}

// const campaignsData: Campaign[] = [
//   {
//     id: "mirabel-centre",
//     title: "Support Mirabel Centre",
//     image: "/images/mirabel-centre.jpg",
//     category: "Education",
//     description:
//       "Every survivor of sexual and gender-based violence (SGBV) deserves a chance to heal, rebuild and thrive. That's why Mirabel Centre has been a beacon of hope in Lagos since 2013. As the leading Sexual Assault Referral Centre (SARC), they provide free, compassionate support to survivors through medical care, counseling, medications, skills training, and so much more.",
//     goal: {
//       amount: 5200,
//       raised: 3640,
//       currency: "£",
//     },
//     donationCount: 32,
//     percentComplete: 70,
//     status: "ongoing",
//   },
//   {
//     id: "nicholas-college",
//     title: "Help Nicholas go back to college",
//     image: "/images/nicholas.jpg",
//     category: "Education",
//     description:
//       "Nicholas is a brilliant student who needs support to continue his education.",
//     goal: {
//       amount: 10000,
//       raised: 10000,
//       currency: "NGN",
//     },
//     donationCount: 145,
//     percentComplete: 100,
//     status: "completed",
//   },
//   {
//     id: "nicholas-college-2",
//     title: "Help Nicholas go back to college",
//     image: "/images/nicholas.jpg",
//     category: "Education",
//     description:
//       "Nicholas is continuing his masters degree and needs additional support.",
//     goal: {
//       amount: 15000,
//       raised: 15000,
//       currency: "NGN",
//     },
//     donationCount: 210,
//     percentComplete: 100,
//     status: "completed",
//   },
// ]

const donorsData: Donor[] = [
  {
    id: "donor-1",
    name: "Nimat Craig",
    amount: 5400,
    currency: "N",
    timeAgo: "5 hours ago",
    isAnonymous: false,
  },
  {
    id: "donor-2",
    name: "Akintomiwa Ajayi",
    amount: 5400,
    currency: "N",
    timeAgo: "6 hours ago",
    isAnonymous: false,
  },
  {
    id: "donor-3",
    name: "Ade Ayegbo",
    amount: 5400,
    currency: "N",
    timeAgo: "6 hours ago",
    isAnonymous: false,
  },
  {
    id: "donor-4",
    name: "Nathaniel Hide",
    amount: 5400,
    currency: "N",
    timeAgo: "6 hours ago",
    isAnonymous: true,
  },
]

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
          ? "bg-white text-black border border-gray-200"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  )
}

// Sample Data
const organizationData: OrganizationProfile = {
  id: "beauty-hut",
  name: "Beauty Hut",
  type: "Organization",
  logo: "/images/beauty-hut-logo.svg",
  coverImage: "/images/beauty-hut-cover.jpg",
  bio: "At Beauty Hut, we're a female-founded brand with a deep commitment to supporting women. We believe in ensuring survivors have access to the care they need to reclaim their strength and dignity. This is where you come in...",
  isVerified: true,
  profileLink: "beautyhut.org",
  stats: {
    totalRaised: 200000,
    totalRaisedFormatted: "$200,000",
    livesImpacted: 2000,
    activeCampaigns: 1,
    totalCampaigns: 10,
    currency: "$",
  },
  socials: {
    email: "info@beautyhut.org",
    instagram: "beautyhut",
    twitter: "beautyhut",
  },
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
