"use client"
import Header from "./_components/layout/Header"
import Sidebar from "./_components/layout/Sidebar"
import Page from "./_components/layout/Page"
import UserProvider from "../../../contexts/UserProvider"
import { NotificationProvider } from "./_common/hooks/useNotification"

import { RFC } from "@/types"
import { PropsWithChildren } from "react"

const DashboardLayout: RFC = (props: PropsWithChildren) => {
  return (
    <NotificationProvider>
      <div className="flex flex-col h-full font-satoshi">
        <Header />
        <div className="flex grow overflow-hidden">
          <Sidebar />
          <Page /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
            {...props}
          />
          {/* <Page children={children} /> won't work */}
        </div>
      </div>
    </NotificationProvider>
    // <UserProvider>
    // </UserProvider>
  )
}

export default DashboardLayout
