import { IUser } from "../app/api/user/getUser"
import { redirect } from "next/navigation"

export const handleUserRedirection = (
  user: IUser | null,
  customRedirectFn?: Function
) => {
  if (!user) return

  const redirectFn = customRedirectFn || redirect
  if (!user.isEmailVerified) {
    return redirectFn("/confirmation")
  }
  if (user.userType === "non-profit" && !user.organizationId) {
    return redirectFn("/register-organization")
  }
  return redirectFn("/dashboard/campaigns")
}
