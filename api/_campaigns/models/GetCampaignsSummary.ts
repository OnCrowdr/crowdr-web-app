// payload
export interface IGetCampaignsSummaryParams {
  userId: string
  startDate?: string
  endDate?: string
}

// response
export interface IGetCampaignsSummaryResponse {
  success: boolean;
  message: string;
  data:    IGetCampaignsSummaryResponseData;
}

export interface IGetCampaignsSummaryResponseData {
  totalNoOfCampaigns:    number;
  totalCampaignViews:    number;
  totalAmountDonated:    TotalAmountDonated[];
  campaignCountByStatus: CampaignCountByStatus;
}

export interface CampaignCountByStatus {
  completed?: number;
  active?:    number;
  pending?:    number;
}

export interface TotalAmountDonated {
  currency:    string;
  totalAmount: number;
}
