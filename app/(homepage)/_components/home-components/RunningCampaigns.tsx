"use client"

import _campaigns from "@/api/_campaigns"
import { IGetCampaignsParams } from "@/api/_campaigns/models/GetCampaigns"
import query from "@/api/query"
import {
  isFundraise,
  isVolunteer,
} from "@/app/(protected)/dashboard/_common/utils/campaign"
import ExploreCard from "@/app/(protected)/dashboard/_components/ExploreCard"
import CampaignCardSkeleton from "@/app/(protected)/dashboard/_components/skeletons/CampaignCardSkeleton"
import useQueryKey from "@/hooks/useQueryKey"
import { useElementSize, useViewportSize } from "@mantine/hooks"
import Link from "next/link"
import { useQuery } from "react-query"

const RunningCampaigns = () => {
  const { width: windowWidth } = useViewportSize()
  const { ref: titleElementRef, width: titleElementWidth } = useElementSize()
  const carouselOffset = Math.abs((windowWidth - titleElementWidth) / 2)
  const queryKey = useQueryKey()
  const params: IGetCampaignsParams = { perPage: 10, sortBy: 'donatedAmount' } as any

  const campaignsQuery = useQuery({
    queryKey: queryKey(query.keys.CAMPAIGNS, params),
    queryFn: () => _campaigns.getCampaigns(params),
  })
  const campaigns = campaignsQuery.data

  return (
    <section className="pt-12 md:pt-20 pb-14 md:pb-[114px]">
      <div
        ref={titleElementRef}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-2 gap-x-12 max-w-[1220px] px-[20px] mb-8 md:mb-7 mx-auto"
      >
        <h4 className="text-[28px] md:text-[42px] text-[#181A1D] font-medium">
          Others are already fundraising on Crowdr
        </h4>
      </div>

      <div className="overflow-x-auto max-w-full scrollbar scrollbar-none mb-16">
        <div className="flex">
          <div
            style={{ "--offset": `${carouselOffset}px` } as any}
            className="min-w-[20px] md:min-w-[calc(var(--offset)_+_20px)]"
          />

          {campaigns ? (
            campaigns.campaigns.length ? (
              <div className="flex gap-4">
                {campaigns.campaigns.map((campaign, index) => {
                  const urlsOnly = campaign.campaignAdditionalImages.map(
                    (item) => item.url
                  )
                  const userDetails = campaign?.user
                  const donatedAmount = campaign?.totalAmountDonated?.[0].amount

                  return (
                    <div key={campaign._id} className="w-[350px]">
                      <ExploreCard
                        key={campaign._id}
                        userId={userDetails?._id}
                        id={campaign._id}
                        name={
                          (userDetails?.userType === "individual"
                            ? userDetails?.fullName
                            : userDetails?.organizationName) ?? "User"
                        }
                        tier={userDetails?.userType}
                        header={campaign?.title}
                        category={campaign?.category}
                        totalAmount={
                          isFundraise(campaign)
                            ? campaign.fundraise?.fundingGoalDetails[0].amount
                            : 0
                        }
                        currency={
                          isFundraise(campaign)
                            ? campaign.fundraise?.fundingGoalDetails[0].currency
                            : "0"
                        }
                        currentAmount={donatedAmount}
                        timePosted={campaign?.campaignEndDate}
                        volunteer={
                          isVolunteer(campaign)
                            ? campaign?.volunteer
                            : undefined
                        }
                        totalVolunteers={campaign.totalNoOfCampaignVolunteers}
                        slideImages={[
                          campaign?.campaignCoverImage?.url,
                          ...(urlsOnly || []),
                        ]}
                        donateImage=""
                        routeTo={`/explore/c/${campaign._id}`}
                        avatar={campaign?.photo?.url || ""}
                        campaignType={campaign.campaignType}
                        // showCtaButtons={false}
                        limitTitleToOneLine={true}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center font-bold text-lg my-6">
                No campaigns available at this moment
              </p>
            )
          ) : campaignsQuery.error instanceof Error ? (
            <p className="text-center font-bold text-lg my-6">
              {campaignsQuery.error.message}
            </p>
          ) : (
            <div className="flex gap-4">
              {Array.from({ length: 10 }).map((item, index) => (
                <div key={index} className="w-[280px] md:w-[350px]">
                  <CampaignCardSkeleton key={index} />
                </div>
              ))}
            </div>
          )}

          <div
            style={{ "--offset": `${carouselOffset}px` } as any}
            className="min-w-[20px] md:min-w-[calc(var(--offset)_+_20px)]"
          />
        </div>
      </div>

      <div className="flex justify-center md:justify-end max-w-[1220px] px-[20px] mx-auto">
        <Link
          href={"/explore"}
          className="btn-primary whitespace-nowrap text-center !w-[170px]"
        >
          See more
        </Link>
      </div>
    </section>
  )
}

export default RunningCampaigns
