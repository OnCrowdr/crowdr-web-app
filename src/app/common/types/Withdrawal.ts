export interface IWithdrawalResponse {
  withdrawals: Withdrawal[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Withdrawal {
  _id: string;
  userId: string;
  campaignId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  campaign: Campaign;
  totalAmountDonated: TotalAmountDonated[];
  reason?: string;
}

export interface Campaign {
  _id: string;
  userId: string;
  category: string;
  title: string;
  story: string;
  campaignType: string;
  campaignStatus: string;
  campaignCoverImage: string;
  campaignAdditionalImages: string[];
  campaignStartDate: string;
  campaignEndDate: string;
  campaignViews: number;
  fundraise: Fundraise;
  volunteer?: Volunteer;
}

export interface Fundraise {
  fundingGoalDetails: TotalAmountDonated[];
}

export interface TotalAmountDonated {
  amount: number;
  currency: Currency;
}

export type Currency = "dollar" | "naira"

export interface Volunteer {
  skillsNeeded: string[];
  ageRange: string;
  genderPreference: string;
  commitementStartDate: string;
  commitementEndDate: string;
  requiredCommitment: string;
  additonalNotes: string;
}

export type WithdrawalStatus = "approved" | "rejected" | "in-review"