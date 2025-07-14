import {
  IPostSignUpResponse,
  IPostSignUpResponseData,
  UserType,
} from "./PostSignUp"

// payload
export interface IPostSignInBody {
  email: string
  password: string
}

// response
export interface IPostSignInResponse {
  success: boolean
  message: string
  data: IPostSignInResponseData
}

export type IPostSignInResponseData = IPostSignUpResponseData & {
  token: string
}

// error
export interface IPostSignInError {
  error: "EMAIL_NOT_VERIFIED"
  message: string
  solution: string
  email: string
  statusCode: number
}
