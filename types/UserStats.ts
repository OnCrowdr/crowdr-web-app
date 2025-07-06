export interface CampaignStatsResponse {
  success: boolean
  message: string
  data: ICampaignStats
}

export interface ICampaignStats {
  totalAmountDonated: TotalAmountDonated[]
  totalNoOfCampaigns: number
  totalCampaignViews: number
}

export interface DonationStatsResponse {
  success: boolean
  message: string
  data: IDonationStats
}

export interface IDonationStats {
  totalAmountDonated: TotalAmountDonated[]
  totalNoOfCampaigns: number
}

export interface TotalAmountDonated {
  currency: string
  totalAmount: number
}