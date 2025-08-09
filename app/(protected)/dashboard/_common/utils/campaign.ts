import {
  Campaign,
  FundraiseCampaign,
  VolunteerCampaign
} from "@/api/_campaigns/models/GetCampaigns";
import { formatAmount } from "./currency";
import { getDuration } from "./date";

import {
  IFundraiseCampaign,
  ICampaign,
  IVolunteerCampaign
} from "@/types/Campaign";

export const mapCampaignResponseToView = (campaign: Campaign) => {
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
    isCompleted
  } = campaign;

  let fundingGoal,
    fundsGotten,
    percentage,
    allDonors,
    allVolunteers,
    withdrawableAmount,
    // serviceFee,
    // payableAmount,
    // totalAmount,
    fundsToReceive,
    amountDonated,
    duration = getDuration(campaignStartDate, campaignEndDate);

  if (isFundraise(campaign)) {
    const [fundingGoalDetail] = campaign.fundraise.fundingGoalDetails;
    const [totalAmountDonated] = campaign.totalAmountDonated;
    const [withdrawableAmountData] = campaign.withdrawableAmounts;

    fundingGoal = formatAmount(
      fundingGoalDetail.amount,
      fundingGoalDetail.currency
    );

    withdrawableAmount = formatAmount(
      withdrawableAmountData.amount,
      withdrawableAmountData.currency
    );

    fundsGotten = formatAmount(
      totalAmountDonated.amount,
      totalAmountDonated.currency
    );

    fundsToReceive = formatAmount(
      totalAmountDonated.payableAmount,
      totalAmountDonated.currency
    );

    percentage = Math.floor(
      (totalAmountDonated.amount / fundingGoalDetail.amount) * 100
    );

    amountDonated = totalAmountDonated;

    // serviceFee = totalAmountDonated.serviceFee
    // payableAmount = totalAmountDonated.payableAmount
    // totalAmount = totalAmountDonated.amount
  }

  if (isVolunteer(campaign)) {
    duration = getDuration(
      campaign.volunteer.commitementStartDate,
      campaign.volunteer.commitementEndDate
    );
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
    withdrawableAmount,
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
    amountDonated
  };
};

export type ICampaignView = ReturnType<typeof mapCampaignResponseToView>;

export function isFundraise(campaign: Campaign): campaign is FundraiseCampaign {
  return "fundraise" in campaign;
}

export function isVolunteer(campaign: Campaign): campaign is VolunteerCampaign {
  return "volunteer" in campaign;
}
