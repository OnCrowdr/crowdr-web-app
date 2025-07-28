import { IPostSignInResponseData } from "@/api/_users/models/PostSignIn"
import { IUser } from "./api/user/getUser"
import { redirect } from "next/navigation"
import { UserType } from "@/types"

export const handleUserRedirection = (
  user: IPostSignInResponseData | null,
  customRedirectFn?: Function
) => {
  if (!user) return

  const redirectFn = customRedirectFn || redirect
  if (!user.isEmailVerified) {
    return redirectFn("/confirmation")
  }
  if (user.userType === UserType.NonProfit && !user.organizationId) {
    return redirectFn("/register-organization")
  }
  if (user.isAdmin) {
    return redirectFn("/admin")
  }
  return redirectFn("/dashboard")
}
