"use client"
import { useState } from "react"
import { useQuery } from "react-query"
import { useUser } from "../common/hooks/useUser"
import ExploreCard from "../dashboard-components/ExploreCard"
import makeRequest from "@/utils/makeRequest"
import { isFundraise, isVolunteer } from "../common/utils/campaign"
import { extractErrorMessage } from "@/utils/extractErrorMessage"
import { keys } from "../utils/queryKeys"
import { campaignsTag } from "@/tags"

import { ICampaignResponse, IFundraiseVolunteerCampaign } from "@/app/common/types/Campaign"
import { QF } from "@/app/common/types"

export default function DynamicExplore({
  hasNextPage,
}: {
  hasNextPage?: boolean
}) {
  const [campaigns, setCampaigns] = useState<IFundraiseVolunteerCampaign[]>([])
  const [page, setPage] = useState(2)
  const user = useUser()

  const { data } = useQuery(
    [keys.explore.campaigns, user?.token, page],
    fetchCampaigns,
    {
      enabled: Boolean(user?.token),
      onSuccess: (data) => {
        if (data) {
          const newCampaigns = data.campaigns
          setCampaigns((prevCampaigns) => [...prevCampaigns, ...newCampaigns])
        }
      },
    }
  )

  const handleSeeMore = () => {
    setPage((prevPage) => prevPage + 1)
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-2.5 min-w-full md:grid-cols-2 ">
        {Array.isArray(campaigns) &&
          campaigns?.map((campaign, index) => {
            const urlsOnly = campaign.campaignAdditionalImages.map(
              (item) => item.url
            )

            const userDetails = campaign?.user
            const donatedAmount = campaign?.totalAmountDonated?.[0].amount
            return (
              <ExploreCard
                id={campaign._id}
                name={userDetails?.organizationName}
                tier={userDetails?.userType}
                header={campaign?.title}
                subheader={campaign?.story}
                totalAmount={
                  isFundraise(campaign)
                    ? campaign.fundraise?.fundingGoalDetails[0].amount
                    : undefined
                }
                currentAmount={donatedAmount}
                timePosted={campaign?.campaignEndDate}
                category={campaign?.category}
                volunteer={
                  isVolunteer(campaign) ? campaign?.volunteer : undefined
                }
                slideImages={[
                  campaign?.campaignCoverImage?.url,
                  ...(urlsOnly || []),
                ]}
                donateImage={
                  "https://res.cloudinary.com/crowdr/image/upload/v1697259678/hyom8zz9lpmeyuhe6fss.jpg"
                }
                routeTo={`/explore/donate-or-volunteer/${campaign._id}`}
                avatar={
                  campaign?.photo?.url || ""
                }
                key={index}
                campaignType={campaign.campaignType}
              />
            )
          })}
      </div>

      {hasNextPage && (
        <div className="flex justify-end items-center mt-4">
          <span onClick={handleSeeMore} className={"cursor-pointer"}>
            See more
          </span>
        </div>
      )}
    </>
  )
}

type Data = ICampaignResponse | undefined
type Token = string | undefined
type Page = number
const fetchCampaigns: QF<Data, [Token, Page]> = async ({ queryKey }) => {
  const [_, token, page] = queryKey

  if (token) {
    const endpoint = `/api/v1/campaigns?page=${page}&perPage=10`
    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<ICampaignResponse>(endpoint, {
        headers,
        tags: [campaignsTag],
      })

      return data
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}