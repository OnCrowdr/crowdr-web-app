import makeRequest from "@/utils/makeRequest";

export interface PublicDonation {
  _id: string;
  fullName: string;
  amount: string;
  currency: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface PublicDonationsResponse {
  donations: PublicDonation[];
  pagination: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

const getCampaignDonations = async (
  campaignId: string,
  params: PaginationParams = {}
): Promise<PublicDonationsResponse> => {
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 20;
  const url = `/campaigns/${campaignId}/donations?page=${page}&perPage=${perPage}`;

  try {
    const response = await makeRequest(url, {
      method: "GET"
    });
    
    // Handle different possible response structures
    const responseData = response?.data?.data || response?.data || response;
    
    // If the response is already in the expected format
    if (responseData?.donations && responseData?.pagination) {
      return responseData;
    }
    
    // If the response is an array of donations (fallback)
    if (Array.isArray(responseData)) {
      return {
        donations: responseData,
        pagination: {
          total: responseData.length,
          currentPage: page,
          perPage: perPage,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
    
    // Default empty response
    return {
      donations: [],
      pagination: {
        total: 0,
        currentPage: 1,
        perPage: perPage,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default {
  getCampaignDonations
};
