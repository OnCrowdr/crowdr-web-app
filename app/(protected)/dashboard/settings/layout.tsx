"use client"
import { useEffect, useState } from "react"
import { useUser } from "../../../../contexts/UserProvider"
import Tabs from "../_components/Tabs"
import { RFC } from "@/types"
import { useAuth } from "@/contexts/AppProvider"

const SettingsLayout: RFC = ({ children }) => {
  const [settingsPages, setSettingsPages] = useState<typeof pages>()
  const {user } = useAuth()

  useEffect(() => {
    if (user && user.userType === "non-profit") {
      setSettingsPages(pages)
    } else {
      const pagesToDisplay = pages.filter(
        (page) => page.title !== "Organization"
      )
      setSettingsPages(pagesToDisplay)
    }
  }, [user])

  return (
    <div>
      <h2 className="text-2xl font-bold">Settings</h2>
      {settingsPages && (
        <Tabs styles={{ header: "-mx-5 md:mx-0" }}>
          {settingsPages.map((page, index) => (
            <Tabs.Item
              key={index}
              heading={page.title}
              href={`/dashboard/settings/${page.route}`}
            >
              {children}
            </Tabs.Item>
          ))}
        </Tabs>
      )}
    </div>
  )
}

export default SettingsLayout

const pages = [
  {
    route: "profile",
    title: "Profile",
  },
  {
    route: "organization",
    title: "Organization",
  },
  {
    route: "password",
    title: "Password",
  },
  {
    route: "payment",
    title: "Payment and Payouts",
  },
  {
    route: "verification",
    title: "Verification",
  },
]
