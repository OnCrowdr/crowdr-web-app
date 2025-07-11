import { AxiosHeaders } from "axios"

// payload
export interface IPostVerifyEmailHeaders extends AxiosHeaders {
  "x-auth-token": string
}
