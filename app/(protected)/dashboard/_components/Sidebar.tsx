"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { atom, useAtom } from "jotai"
import Link from "next/link"
import Image from "next/image"
import ModalTrigger from "../../../../components/shared/ModalTrigger"
import DrawerTrigger from "../../../../components/shared/DrawerTrigger"
import { useUser } from "../../../../contexts/UserProvider"
import { useNotification } from "../_common/hooks/useNotification"
import { Page, pageGroups as _pageGroups } from "../pages"
import Icon from "./Icon"

import { RFC } from "@/types"
import CrowdrLogo from "@/public/images/brand/crowdr-logo.svg"
import shield from "@/public/svg/shield.svg"
import bell from "@/public/svg/bell.svg"
import bell_dot from "@/public/svg/bell-dot.svg"

export const pageDrawerAtom = atom("")

const Sidebar: RFC<SidebarProps> = ({ drawer }) => {
  const user = useUser()
  const [currentDrawerId, setCurrentDrawerId] = useAtom(pageDrawerAtom)
  const currentPath = usePathname()
  const { unseenCount, setUnseenCount, markAllMessagesAsSeen } =
    useNotification()
  const wrapperStyle = drawer ? "flex" : "hidden md:flex overflow-y-auto"

  useEffect(() => {
    const updatePageGroups = pageGroups.map((pageGroup) => {
      const notificationPage = pageGroup.find(
        (page) => page.title === "Notifications"
      )
      if (notificationPage) {
        if (unseenCount > 0) {
          notificationPage.icon = bell_dot
        } else {
          notificationPage.icon = bell
        }
      }

      return pageGroup
    })

    setPageGroups(updatePageGroups)
  }, [unseenCount])

  const toggleDrawer = (drawerId: string) => {
    if (drawerId) {
      if (currentDrawerId === drawerId) {
        // setCurrentDrawerId("")
      } else {
        setCurrentDrawerId(drawerId)
      }
    } else {
      setCurrentDrawerId("")
    }

    setUnseenCount((prev) => {
      if (drawerId === "notifications" && prev > 0) {
        markAllMessagesAsSeen()
      }
      return prev
    })
  }

  const setSidebarItems = () => {
    if (!user?.isAdmin) {
      return _pageGroups
    }

    const adminDashboard = new Page(
      { route: "#/admin/dashboard" },
      "Admin Dashboard",
      shield
    )

    return _pageGroups.map((pageGroup, index) => {
      if (index + 1 !== _pageGroups.length) {
        return pageGroup
      }

      return [adminDashboard, ...pageGroup]
    })
  }

  const [pageGroups, setPageGroups] = useState(setSidebarItems)

  useEffect(() => {
    setPageGroups(setSidebarItems)
  }, [user])

  const sidebarItems = pageGroups.map((pageGroup, index) => (
    <div key={index} className="pl-[26px] pr-[27px]">
      {index == 0 || <hr className="border-[rgba(56, 56, 56, 0.08)]" />}

      <div className="py-[27px]">
        {pageGroup.map(({ page, title, icon, label }, index) => {
          let pageLinkStyle =
            "flex items-center flex-wrap gap-y-1 gap-x-2 font-medium text-[0.96rem] rounded-[0.275rem] transition pl-[28px] pt-[14px] pb-[15px] w-[220px]"

          const isRoute = "route" in page
          let isCurrentPage = false
          if (isRoute) {
            // IF IT'S A ROUTE AND A DRAWER IS CURRENTLY ACTIVE, IT ISN'T THE CURRENT PAGE.
            isCurrentPage = currentDrawerId // OR ELSE CHECK IF THE ROUTE PATH MATCHES WITH THE CURRENT URL PATH
              ? false
              : page.route !== "" &&
                currentPath.startsWith("/dashboard/" + page.route.split("/")[0])
          } else if (!page.noHighlight) {
            isCurrentPage = currentDrawerId === page.modalId
          }

          let iconStyle = isCurrentPage ? "brightness-[200]" : ""
          if (index !== 0) pageLinkStyle += " mt-[10px]"

          if (isCurrentPage) {
            pageLinkStyle += " text-white bg-[#00B964] cursor-pointer"
          } else if (isRoute ? page.route : page.modalId) {
            pageLinkStyle += " hover:bg-[#F8F8F8] cursor-pointer"
          } else {
            pageLinkStyle += " cursor-default"
          }

          let modalProps: any = {
            // IF IT'S A ROUTE AND THERE'S AN ACTIVE DRAWER, HIDE THE DRAWER
            id: isRoute ? currentDrawerId : isCurrentPage ? "" : page.modalId,
            type: isRoute || currentDrawerId ? "hide" : "show",
          }

          // if (!isRoute && isCurrentPage) {
          //   modalProps = {}
          // }

          const isValidRoute = isRoute && page.route
          const NavItem: any = isValidRoute ? Link : "span"
          const linkProps: any = {
            ...(isValidRoute
              ? {
                  href: page.route.startsWith("#")
                    ? page.route.replace("#", "")
                    : `/dashboard/${page.route}`,
                }
              : {}),
            className: pageLinkStyle,
          }

          return (
            <ModalTrigger
              key={title}
              {...modalProps}
              options={{
                backdrop: "dynamic",
                onHide: () => toggleDrawer(""),
                onShow: () => toggleDrawer(isRoute ? "" : page.modalId),
                backdropClasses:
                  "bg-[#50556F] bg-opacity-30 fixed inset-0 z-40",
              }}
            >
              <DrawerTrigger id="sidebar_drawer" type="hide">
                <NavItem {...linkProps}>
                  <Image
                    src={icon}
                    width={18}
                    height={18}
                    alt=""
                    className={iconStyle}
                  />
                  {title}
                  {label && (
                    <span className="bg-green-100 text-green-400 text-[0.55rem] whitespace-nowrap font-semibold px-1.5 py-0.5 rounded">
                      {label}
                    </span>
                  )}
                </NavItem>
              </DrawerTrigger>
            </ModalTrigger>
          )
        })}
      </div>
    </div>
  ))

  return (
    <nav
      className={
        wrapperStyle +
        " flex-col justify-start max-w-[272px] shrink-0 h-full bg-white overflow-x-hidden"
      }
    >
      <div
        className={
          (drawer ? "flex" : "hidden") +
          " min-h-[62px] md:min-h-[74px] border-b-[0.7px] border-[rgba(56, 56, 56, 0.08)] px-[25px]"
        }
      >
        <Image
          src={CrowdrLogo}
          alt="crowdr logo"
          className="w-[52px] md:w-[52px]"
        />
      </div>

      {drawer ? (
        <div className="flex flex-col overflow-x-hidden overflow-y-auto grow">
          {sidebarItems}
        </div>
      ) : (
        sidebarItems
      )}
    </nav>
  )
}

export default Sidebar

type SidebarProps = {
  drawer?: boolean
}
