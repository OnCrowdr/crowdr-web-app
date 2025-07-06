import { PropsWithChildren } from "react"
import { getUser } from "../../utils/api/user/getUser"
import { handleUserRedirection } from "../../utils/handleUserRedirection"
import { redirect } from "next/navigation"

export default async function Layout({ children }: PropsWithChildren) {
  const user = await getUser()

  if (user) {
    redirect(user.isAdmin ? "/admin" : "/dashboard")
  }

  return <section className="font-satoshi">{children}</section>
}
