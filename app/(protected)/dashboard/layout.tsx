"use client";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import Page from "./_components/Page";
import UserProvider from "../../../contexts/UserProvider";
import { NotificationProvider } from "./_common/hooks/useNotification";

import { RFC } from "@/types";
import { PropsWithChildren } from "react";

const DashboardLayout: RFC = (props: PropsWithChildren) => {
  return (
    <UserProvider>
      <NotificationProvider>
        <div className="flex flex-col h-full font-satoshi">
          <Header />
          <div className="flex grow overflow-hidden">
            <Sidebar />
            <Page /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
            {...props} />
            {/* <Page children={children} /> won't work */}
          </div>
        </div>
      </NotificationProvider>
    </UserProvider>
  );
};

export default DashboardLayout;
