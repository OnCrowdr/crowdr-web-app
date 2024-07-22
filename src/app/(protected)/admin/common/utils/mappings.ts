import { toTitleCase } from "@/utils/toTitleCase"
import { formatAmount } from "@/app/(protected)/(dashboard)/common/utils/currency"

import {
  Campaign,
  CampaignType,
} from "../services/campaign/models/GetCampaigns"
import { Withdrawal } from "../services/withdrawal/models/GetWithdrawals"
import { Kyc } from "../services/kyc/models/GetKycs"

const mapCampaignResponseToView = (campaigns: Campaign[]) => {
  return campaigns.map((campaign) => {
    const isFundraising =
      campaign.campaignType == CampaignType.Fundraise ||
      campaign.campaignType == CampaignType.FundraiseVolunteer

    const [raisedAmount] = isFundraising ? campaign.totalAmountDonated : []
    const [targetAmount] = isFundraising
      ? campaign.fundraise.fundingGoalDetails
      : []

    const formattedRaisedAmount = isFundraising
      ? formatAmount(raisedAmount.amount, raisedAmount.currency)
      : "--"
    const formattedTargetAmount = isFundraising
      ? formatAmount(targetAmount.amount, targetAmount.currency)
      : "--"

    const progressPercentage =
      isFundraising && targetAmount.amount !== 0
        ? (raisedAmount.amount / targetAmount.amount) * 100
        : "--"

    return {
      id: campaign._id,
      accountName:
        campaign.user.organizationName || campaign.user.fullName || "--",
      title: campaign.title,
      email: "--",
      type: toTitleCase(campaign.campaignType).replace("And", "/"),
      raisedAmount: formattedRaisedAmount,
      targetAmount: formattedTargetAmount,
      progressPercentage,
      imageUrl: "",
    }
  })
}

const mapKycResponseToView = (kycs: Kyc[]) => {
  return kycs.map((kyc) => ({
    id: kyc._id,
    accountName: kyc.user.organizationName || kyc.user.fullName,
    accountType: kyc.user.userType,
    status: kyc.verificationStatus || "pending",
    imageUrl: "",
  }))
}

const mapWithdrawalResponseToView = (withdrawals: Withdrawal[]) => {
  return withdrawals.map((withdrawal) => {
    const [{ currency, payableAmount }] = withdrawal.totalAmountDonated
    const formattedAmount = formatAmount(payableAmount, currency)

    return {
      id: withdrawal._id,
      accountName: withdrawal.user.organizationName || withdrawal.user.fullName,
      campaignTitle: withdrawal.campaign.title,
      status: withdrawal.status,
      amount: formattedAmount,
      imageUrl: "",
    }
  })
}

export { mapCampaignResponseToView, mapKycResponseToView, mapWithdrawalResponseToView }
