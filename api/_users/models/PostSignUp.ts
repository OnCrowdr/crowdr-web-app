import { UserType } from "@/types"

// payload
export interface IPostSignUpBody {
  fullName: string
  gender: string
  organizationName: string
  email: string
  phoneNumber: string
  interests: string[]
  password: string
  referrer: string
}

// response
export interface IPostSignUpResponse {
  success: boolean
  message: string
  data: IPostSignUpResponseData
}

export type IPostSignUpResponseData = IndividualResponse | NonProfitResponse

interface IndividualResponse extends IPostSignUpBaseResponse {
  userType: UserType.Individual
  fullName: string
}

interface NonProfitResponse extends IPostSignUpBaseResponse {
  userType: UserType.NonProfit
  organizationId: string
  organizationName: string
}

export interface IPostSignUpBaseResponse {
  _id: string
  gender: string
  email: string
  interests: string[]
  isEmailVerified: boolean
  isAdmin: boolean
}