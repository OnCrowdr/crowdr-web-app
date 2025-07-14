"use client";

import makeRequest from "@/utils/makeRequest";
import { QUERYKEYS } from "@/utils/queryKeys";
import { useQuery } from "react-query";

export type DonatedAmount = {
  currency: string;
  amount: number;
};

export type CampaignDonors = {
  _id: string;
  amount: string;
  campaignDonorId: string;
  campaignId: string;
  campaignOwnerId: string;
  currency: string;
  fullName: string;
  isAnonymous: boolean;
  isSubscribedToPromo: boolean;
  shouldShareDetails: boolean;
  transactionRef: string;
};

type CampaignImage = {
  _id: string;
  url: string;
  public_id: string;
  id: string;
};

export type Campaign = {
  _id: string;
  category: string;
  title: string;
  story: string;
  campaignType: string;
  campaignStatus: string;
  campaignCoverImage: CampaignImage;
  campaignAdditionalImages: CampaignImage[];
  campaignStartDate: string;
  campaignEndDate: string;
  fundraise: {
    fundingGoalDetails: [
      {
        amount: number;
        currency: string;
      }
    ];
    startOfFundraise: string;
    endOfFundraise: string;
  };
  campaignDonors: CampaignDonors[];
  volunteer: {
    skillsNeeded: string[];
    otherSkillsNeeded: string;
    ageRange: string;
    genderPreference: string;
    commitementStartDate: string;
    commitementEndDate: string;
    requiredCommitment: string;
    additonalNotes: string;
    volunteersNeeded: number;
  };
  totalAmountDonated: DonatedAmount[];
  totalNoOfCampaignVolunteers: number;
  totalNoOfCampaignDonors: number;
  photo: {
    url: string;
    _id: string;
  };
  user: {
    _id: string;
    interests: string[];
    organizationId: string;
    organizationName: string;
    userType: string;
    fullName: string;
    userId: string;
  };
};

type SingleCampaignResponse = {
  status: boolean;
  message: string;
  data: Campaign;
};

// Client-side function to fetch single campaign
export const fetchSingleCampaign = async (
  campaignId: string,
  noAuth?: boolean
): Promise<Campaign> => {
  const headers: Record<string, string> = {};

  // Get auth token from localStorage or wherever you store it on client-side
  if (!noAuth) {
    const token = localStorage.getItem("authToken"); // Adjust based on your auth implementation
    if (token) {
      headers["x-auth-token"] = token;
    }
  }

  const endpoint = `/campaigns/${campaignId}`;

  const response = await makeRequest<any>(endpoint, {
    headers,
    method: "GET"
  });

  return response.data;
};

export const verifyPaymentReference = async (
  reference: string
): Promise<any> => {
  const endpoint = `/payments/verify/${reference}`;

  const response = await makeRequest<any>(endpoint, {
    method: "GET"
  });

  return response.data;
};

// React Query hook
export const useFetchSingleCampaign = (
  campaignId: string,
  noAuth?: boolean
) => {
  const queryKey = [QUERYKEYS.SINGLE_CAMPAIGN, campaignId, noAuth];

  return useQuery(queryKey, () => fetchSingleCampaign(campaignId, noAuth), {
    enabled: !!campaignId, // Only run query if campaignId exists
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });
};

export const useVerifyPaymentReference = (reference: string | null) => {
  const queryKey = [QUERYKEYS.PAYMENT_VERIFICATION, reference];

  return useQuery(queryKey, () => verifyPaymentReference(reference!), {
    enabled: !!reference, // Only run if reference exists
    retry: 1,
    staleTime: 0, // Don't cache payment verification
    cacheTime: 0 // Don't cache payment verification
  });
};
