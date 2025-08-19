// params
export interface IGetTransactionsParams {
  page: number;
  perPage: number;
  status: string;
  userId: string;
  campaignId: string;
}

// response
export interface IGetTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    data: Transaction[];
    pagination: Pagination;
  };
}

export interface IGetTransactionsResponseData {
  results: Transaction[];
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

export interface Transaction {
  _id: string;
  amount: string;
  transactionFee: number;
  totalAmount: string;
  email: string;
  fullName: string;
  currency: string;
  reference: string;
  campaignId: string;
  campaignDonorId?: string;
  isAnonymous: boolean;
  shouldShareDetails: boolean;
  isSubscribedToPromo: boolean;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}