import { BaseResponse } from "@/api/types";
import { Campaign } from "./GetCampaigns";

// payload
export interface IGetCampaignPath {
  campaignId: string
}

// response
export interface IGetCampaignResponse extends BaseResponse {
  data: Campaign
}