import api from "..";
import { PaginationParams } from "../types";
import { IGetCampaignResponse } from "./models/GetCampaign";
import {
  IGetCampaignDonationsPath,
  IGetCampaignDonationsResponse
} from "./models/GetCampaignDonations";
import { IGetCampaignsResponse } from "./models/GetCampaigns";
import {
  IGetCampaignsSummaryParams,
  IGetCampaignsSummaryResponse
} from "./models/GetCampaignsSummary";
import { IGetCampaignVolunteersResponse } from "./models/GetCampaignVolunteers";

const createCampaign = async (body: any) => {
  const url = `/campaigns`;

  try {
    const { data } = await api.postForm<IGetCampaignResponse>(url, body);
    return data;
  } catch (error) {
    throw error;
  }
};

const updateCampaign = async (
  { campaignId }: IGetCampaignDonationsPath,
  body: any
) => {
  const url = `/campaigns/${campaignId}`;

  try {
    const { data } = await api.putForm<IGetCampaignResponse>(url, body);
    return data;
  } catch (error) {
    throw error;
  }
};

const getCampaigns = async (params: PaginationParams = {}) => {
  const url = `/campaigns`;
  params.page ??= 1;
  params.perPage ??= 10;

  try {
    const { data } = await api.get<IGetCampaignsResponse>(url, { params });
    return data.data;
  } catch (error) {
    throw error;
  }
};

const getCampaign = async (
  { campaignId }: IGetCampaignDonationsPath,
  params: PaginationParams = {}
) => {
  const url = `/campaigns/${campaignId}`;

  try {
    const { data } = await api.get<IGetCampaignResponse>(url, { params });
    return data.data;
  } catch (error) {
    throw error;
  }
};

const getCampaignDonations = async (
  { campaignId }: IGetCampaignDonationsPath,
  params: PaginationParams = {}
) => {
  const url = `/campaigns/${campaignId}/donations`;
  params.page ??= 1;
  params.perPage ??= 10;

  try {
    const { data } = await api.get<IGetCampaignDonationsResponse>(url, {
      params
    });
    return data.data;
  } catch (error) {
    throw error;
  }
};

const getCampaignVolunteers = async (
  { campaignId }: IGetCampaignDonationsPath,
  params: PaginationParams
) => {
  const url = `/campaigns/${campaignId}/volunteers`;
  params.page ??= 1;
  params.perPage ??= 10;

  try {
    const { data } = await api.get<IGetCampaignVolunteersResponse>(url, {
      params
    });
    return data.data;
  } catch (error) {
    throw error;
  }
};

const getCampaignSummary = async (params: IGetCampaignsSummaryParams) => {
  const url = `/campaigns/summary`;

  try {
    const { data } = await api.get<IGetCampaignsSummaryResponse>(url, {
      params
    });
    return data.data;
  } catch (error) {
    throw error;
  }
};

export default {
  createCampaign,
  updateCampaign,
  getCampaigns,
  getCampaign,
  getCampaignDonations,
  getCampaignVolunteers,
  getCampaignSummary
};
