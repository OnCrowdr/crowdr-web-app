import { BaseResponse } from "@/api/types";

// response
export interface IGetKycResponse extends BaseResponse {
  data: Kyc
}

export interface Kyc {
  _id: string
  userId: string
  BVN: string
  docType: string
  docImg: Img
  selfieImg: Img
  verificationStatus: string
  createdAt: string
  updatedAt: string
}

export interface Img {
  url: string
}