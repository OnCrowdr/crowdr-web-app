export interface IkycResponse {
  kycs: Kyc[];
  pagination: Pagination;
}

export interface Kyc {
  _id:                string;
  userId:             string;
  BVN:                string;
  docType:            string;
  docImg:             string;
  selfieImg:          string;
  verificationStatus: string;
  createdAt:          Date;
  updatedAt:          Date;
  __v:                number;
  reason:             string;
  status:             string;
  user:               User;
  id:                 string;
}

export interface User {
  isAdmin:          boolean;
  _id:              string;
  organizationName?: string;
  fullName?: string;
  organizationId:   string;
  userType:         string;
  email:            string;
  interests:        string[];
  referrer:         string;
  isEmailVerified:  boolean;
  isDeleted:        boolean;
}


export interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type KycStatus = "completed" | "rejected" | "pending"