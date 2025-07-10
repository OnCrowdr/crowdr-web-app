import { PropsWithChildren } from "react"
import { getUser } from "../api/user/getUser"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

const confirmationPath = "/confirmation"
const registerOrgPath = "/register-organization"
const adminPath = "/admin"
const dashboard = "/dashboard"
const adminDashboard = `${adminPath}/dashboard`

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const headersList = await headers()
  const user = (await getUser())!
  const currentPath = headersList.get("x-pathname")

  switch (true) {
    // currentPath !== confirmationPath prevents infinite redirect if coming from confirmationPath
    // take unverified users to confirmation page
    case currentPath !== confirmationPath && !user?.isEmailVerified:
      redirect(confirmationPath)

    // take verified non-profit user? without a business to register
    case currentPath !== registerOrgPath &&
      user?.isEmailVerified &&
      user?.userType === "non-profit" &&
      !user?.organizationId:
      redirect(registerOrgPath)

    // prevent non-profit user with an already registerd busines from going to register again
    case currentPath === registerOrgPath &&
      user?.userType === "non-profit" &&
      Boolean(user?.organizationId):
      redirect(dashboard)

    // prevent indiviual user tryig to access register-organization from accessing it
    case currentPath === registerOrgPath && user?.userType === "individual":
      redirect(dashboard)

    // prevent a user that is done with verification & escaped all the business registration check above from going to confirmation again
    case currentPath === confirmationPath && user?.isEmailVerified:
      redirect(dashboard)

    // prevent a user that isn't an admin from accessing admin routes
    case currentPath?.startsWith(adminPath) && !user.isAdmin:
      redirect(dashboard)

    // redirect to /admin/dashboard if user tries to go to /admin
    case currentPath === adminPath && user.isAdmin:
      redirect(adminDashboard)

    default:
      break
  }

  return <div className="h-full">{children}</div>
}
