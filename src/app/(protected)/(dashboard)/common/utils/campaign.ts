import { formatAmount } from "./currency"
import { getDuration } from "./date"

import {
  IFundraiseCampaign,
  IFundraiseVolunteerCampaign,
  IVolunteerCampaign,
} from "@/app/common/types/Campaign"

export const mapCampaignResponseToView = (
  campaign: IFundraiseVolunteerCampaign
) => {
  const {
    _id,
    title,
    story,
    category,
    campaignStatus,
    campaignViews,
    campaignType,
    campaignStartDate,
    campaignEndDate,
    isCompleted,
  } = campaign

  let fundingGoal,
    fundsGotten,
    percentage,
    allDonors,
    allVolunteers,
    // serviceFee,
    // payableAmount,
    // totalAmount,
    fundsToReceive,
    amountDonated,
    duration = getDuration(campaignStartDate, campaignEndDate)

  if (isFundraise(campaign)) {
    const [fundingGoalDetail] = campaign.fundraise.fundingGoalDetails
    const [totalAmountDonated] = campaign.totalAmountDonated

    fundingGoal = formatAmount(
      fundingGoalDetail.amount,
      fundingGoalDetail.currency
    )

    fundsGotten = formatAmount(
      totalAmountDonated.amount,
      totalAmountDonated.currency
    )

    fundsToReceive = formatAmount(
      totalAmountDonated.payableAmount,
      totalAmountDonated.currency
    )

    percentage = Math.floor(
      (totalAmountDonated.amount / fundingGoalDetail.amount) * 100
    )

    amountDonated = totalAmountDonated

    // serviceFee = totalAmountDonated.serviceFee
    // payableAmount = totalAmountDonated.payableAmount
    // totalAmount = totalAmountDonated.amount
  }
  
  if (isVolunteer(campaign)) {
    duration = getDuration(
      campaign.volunteer.commitementStartDate,
      campaign.volunteer.commitementEndDate
    )
  }

  return {
    _id,
    title,
    story,
    category,
    duration,
    status: campaignStatus,
    views: campaignViews,
    donors: allDonors,
    volunteers: allVolunteers,
    fundingGoal,
    fundsGotten,
    percentage,
    campaignType,
    startDate: campaignStartDate,
    endDate: campaignEndDate,
    isCompleted,
    // serviceFee,
    // payableAmount,
    // totalAmount,
    fundsToReceive,
    amountDonated,
  }
}

export type ICampaignView = ReturnType<typeof mapCampaignResponseToView>

export function isFundraise(
  campaign: IFundraiseVolunteerCampaign
): campaign is IFundraiseCampaign {
  return "fundraise" in campaign
}

export function isVolunteer(
  campaign: IFundraiseVolunteerCampaign
): campaign is IVolunteerCampaign {
  return "volunteer" in campaign
}
