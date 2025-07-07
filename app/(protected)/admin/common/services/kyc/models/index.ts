import { KycStatus } from "@/types/Kyc"

export interface IGetKyc {
  kycId: string
  authToken: string
}

export interface IPatchKyc {
  kycId: string
  adminOtp: string
  authToken: string
  verificationStatus: KycStatus
  remark?: string
}

export interface IKyc {
  kyc: Kyc;
  org: Org;
}

export interface Kyc {
  _id:                string;
  userId:             string;
  BVN:                string;
  docType:            string;
  docImg:             DocImg;
  selfieImg:          DocImg;
  verificationStatus: string;
  createdAt:          string;
  updatedAt:          string;
  __v:                number;
  user:               User;
  id:                 string;
  remark:             string;
}

export interface DocImg {
  _id: string;
  url: string;
  id:  string;
}

export interface User {
  _id:              string;
  userType:         string;
  email:            string;
  interests:        string[];
  referrer:         string;
  isAdmin:          boolean;
  isEmailVerified:  boolean;
  isDeleted:        boolean;
  organizationName?: string;
  organizationId?:   string;
  fullName?:   string;
  gender?:   string;
}

export interface Org {
  _id:       string;
  imageId:   DocImg;
  cacNumber: string;
  state:     string;
  publicUrl: string;
  userId:    string;
  __v:       number;
}

