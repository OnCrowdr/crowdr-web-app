// params
export interface IGetWithdrawalsParams {
  page: number;
  perPage: number;
  status: WithdrawalStatus;
  username: string;
}

// response
export interface IGetWithdrawalsResponse {
  success: boolean;
  message: string;
  data: IGetWithdrawalsData;
}

export interface IGetWithdrawalsData {
  withdrawals: Withdrawal[];
  pagination: IGetWithdrawalsPagination;
}

export interface IGetWithdrawalsPagination {
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
  status: WithdrawalStatus;
  createdAt: Date;
  updatedAt: Date;
  remark: string;
  campaign: Campaign;
  user: User;
  totalAmountDonated: TotalAmountDonated[];
  withdrawableAmounts: WithdrawableAmount[];
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
  campaignStartDate: Date;
  campaignEndDate: Date;
  fundraise: Fundraise;
}

export interface Fundraise {
  fundingGoalDetails: FundingGoalDetail[];
}

export interface FundingGoalDetail {
  amount: number;
  currency: string;
}

export interface TotalAmountDonated {
  currency: string;
  amount: number;
  serviceFee: number;
  payableAmount: number;
}

export interface WithdrawableAmount {
  availableAmount: number;
  currency: string;

  breakdown: {
    netAvailable: number;
    serviceFee: number;
    totalDonated: number;
    totalWithdrawn: number;
  };
}

export interface User {
  _id: string;
  userType: string;
  interests: string[];
  isAdmin: boolean;
  fullName: string;
  organizationName: string;
  gender: string;
}

export enum WithdrawalStatus {
  InReview = "in-review",
  Rejected = "rejected",
  Approved = "approved"
}
