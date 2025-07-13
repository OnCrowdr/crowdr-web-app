import { BaseResponse, Pagination } from "@/api/types";

// payload
export interface IGetCampaignDonationsPath {
  campaignId: string
}

// response
export interface IGetCampaignDonationsResponse extends BaseResponse {
  data: IGetCampaignDonationsResponseData
}

export interface IGetCampaignDonationsResponseData {
  donations: IDonation[];
  pagination: Pagination;
}

export interface IDonation {
  _id: string;
  campaignOwnerId: string;
  campaignDonorId: string;
  campaignId: string;
  amount: string;
  email: string;
  currency: string;
  fullName: string;
  isAnonymous: boolean;
  shouldShareDetails: boolean;
  isSubscribedToPromo: boolean;
  transactionRef: string;
  createdAt: string;
  updatedAt: string;
}