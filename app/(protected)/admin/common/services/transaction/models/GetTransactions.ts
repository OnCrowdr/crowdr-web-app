// params
export interface IGetTransactionsParams {
  page: number;
  perPage: number;
  status: string;
  type: string;
  amountOrder: 'asc' | 'desc';
  reference: string;
}

// response
export interface IGetTransactionsResponse {
  success: boolean;
  message: string;
  data: IGetTransactionsResponseData;
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
  reference: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  metadata?: any;
  user: TransactionUser;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionUser {
  _id: string;
  email: string;
  fullName?: string;
  organizationName?: string;
}