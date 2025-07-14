import axios from "axios";
import {
  IGetCampaignsParams,
  IGetCampaignsResponse
} from "./models/GetCampaigns";
import { IGetCampaignStatsResponse } from "./models/GetCampaignStats";
import api from "@/api";

const getCampaigns = async (params: Partial<IGetCampaignsParams> = {}) => {
  const url = `/admin/campaigns`;

  try {
    const res = await api.get<IGetCampaignsResponse>(url, { params });
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

const getCampaignStats = async () => {
  const url = `/admin/campaigns-stats`;

  try {
    const res = await api.get<IGetCampaignStatsResponse>(url);
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export default { getCampaigns, getCampaignStats };
