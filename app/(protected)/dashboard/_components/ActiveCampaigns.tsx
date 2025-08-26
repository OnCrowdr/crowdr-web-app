"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { RFC } from "@/types"
import { formatAmount } from "../_common/utils/currency"
import { Campaign, CampaignType } from "@/api/_campaigns/models/GetCampaigns"
import { isFundraise } from "../_common/utils/campaign"
import { PLACEHOLDER_IMAGE, PLACEHOLDER_PROFILE_IMAGE } from "@/lib/constants"
import { useAuth } from "@/contexts/AppProvider"

const ActiveCampaign: RFC<Props> = ({ campaign }) => {
  const { isAuthenticated, user } = useAuth()

  const [fundingGoalDetail] = isFundraise(campaign)
    ? campaign.fundraise?.fundingGoalDetails
    : []
  const [totalAmountDonated] = campaign.totalAmountDonated

  const fundingGoal = fundingGoalDetail?.amount
    ? formatAmount(fundingGoalDetail.amount, fundingGoalDetail.currency)
    : 0

  const fundsGotten = formatAmount(
    totalAmountDonated.amount,
    totalAmountDonated.currency
  )

  const fundsToReceive = formatAmount(
    totalAmountDonated.amount,
    totalAmountDonated.currency
  )

  const percentage = fundingGoalDetail?.amount
    ? Math.floor((totalAmountDonated.amount / fundingGoalDetail.amount) * 100)
    : 0

  const accountName = campaign.user.fullName ?? campaign.user.organizationName

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      <div className="relative h-48 w-full">
        <Image
          src={campaign.campaignCoverImage.url ?? PLACEHOLDER_IMAGE}
          alt={campaign.title}
          onError={(e) => {
            e.currentTarget.removeAttribute("srcset")
            e.currentTarget.src = PLACEHOLDER_IMAGE
          }}
          fill
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-xs px-2 py-1 rounded-full text-gray-700">
          {campaign.category}
        </div>
      </div>

      <div className="p-4">
        {accountName && (
          <div className="flex items-center gap-2 mb-2">
            {/* TODO: use user image */}
            <Image
              src={PLACEHOLDER_PROFILE_IMAGE}
              alt={accountName}
              width={24}
              height={24}
              className="rounded-full h-6 w-6"
            />
            <span className="text-xs text-gray-600">{accountName}</span>
          </div>
        )}

        <Link
          href={
            user && user._id === campaign.userId
              ? `/explore/c/${campaign._id}`
              : `/explore/c/${campaign._id}`
          }
        >
          <h3 className="font-medium text-base truncate mb-2 hover:text-green-600 transition-colors">
            {campaign.title}
          </h3>
        </Link>

        {campaign.campaignType !== CampaignType.Volunteer && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Goal {fundingGoal}</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {campaign.campaignType === CampaignType.Volunteer && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 pt-2 mb-1">
              Volunteers: {campaign.totalNoOfCampaignVolunteers}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActiveCampaign

interface Props {
  campaign: Campaign
}
