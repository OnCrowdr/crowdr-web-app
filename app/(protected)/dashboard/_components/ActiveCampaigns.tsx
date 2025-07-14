import React from "react"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "../../../../utils/seperateText"
import { RFC } from "@/types"
import { formatAmount } from "../_common/utils/currency"
import {
  Campaign,
  CampaignType,
} from "../../../../api/_campaigns/models/GetCampaigns"
import { isFundraise } from "../_common/utils/campaign"

const ActiveCampaign: RFC<Props> = ({ campaign }) => {
  const [fundingGoalDetail] = isFundraise(campaign) ? campaign.fundraise?.fundingGoalDetails : []
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

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
      <div className="relative h-48 w-full">
        <Image
          src={campaign.campaignCoverImage.url}
          alt={campaign.title}
          fill
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white bg-opacity-90 text-xs px-2 py-1 rounded-full text-gray-700">
          {campaign.category}
        </div>
      </div>

      <div className="p-4">
        {campaign.user.organizationName && (
          <div className="flex items-center gap-2 mb-2">
            {/* TODO: use user image */}
            {campaign.campaignCoverImage && (
              <Image
                src={campaign.campaignCoverImage.url}
                alt={campaign.user.organizationName}
                width={24}
                height={24}
                className="rounded-full h-6 w-6"
              />
            )}
            <span className="text-xs text-gray-600">
              {campaign.user.organizationName ?? campaign.user.fullName}
            </span>
          </div>
        )}

        <Link href={`/campaigns/${campaign._id}`}>
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
