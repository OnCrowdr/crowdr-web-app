"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { atom, useAtom, useAtomValue } from "jotai"
import TextInput from "../../../../components/shared/TextInput"
import { pages as _pages } from "../pages"
import userService from "../common/services/user"
import { useUser } from "../../../../contexts/UserProvider"

import CrowdrLogo from "@/public/images/brand/crowdr-logo.svg"
import CrowdrLogoType from "@/public/svg/crowdr-logo.svg"
import SearchIcon from "@/public/svg/search.svg"
import LogoutIcon from "@/public/svg/logout-2.svg"

export const userCountAtom = atom(0)

const Sidebar = () => {
  const [searchText, setSearchText] = useState("")
  const currentPath = usePathname()
  const [pages, setPages] = useState(_pages)
  const [userCount, setUserCount] = useAtom(userCountAtom)
  const user = useUser()

  useEffect(() => {
    if (user) {
      userService.getUsers({ perPage: 1 }).then((res) => {
        setUserCount(res.pagination.total)
      })
    }
  }, [user])

  useEffect(() => {
    const _pages = structuredClone(pages)
    const usersPage = _pages.find((page) => page.title === "Users")

    if (usersPage) {
      usersPage.label = userCount.toString()
      setPages(_pages)
    }
  }, [userCount])

  return (
    <nav className="flex flex-col justify-between overflow-x-hidden overflow-y-auto max-w-[280px] shrink-0 h-full bg-white py-8">
      <div className="flex flex-col gap-y-6">
        {/* logo */}
        <Link href="/dashboard/explore" className="flex items-center px-6">
          <Image src={CrowdrLogo} alt="crowdr logo" className="w-[50px]" />
          <Image
            src={CrowdrLogoType}
            alt="crowdr logotype"
            className="w-[77px]"
          />
        </Link>

        {/* search */}
        <TextInput
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value)
          }}
          placeholder="Search"
          iconUrl={SearchIcon}
          styles={{
            wrapper: "px-6",
            input: "text-base",
          }}
        />

        {/* pages */}
        <div className="flex flex-col gap-y-1 px-4">
          {pages.map(({ route, title, icon, label }, index) => {
            let pageLinkStyle =
              "flex items-center flex-wrap gap-x-3 font-semibold rounded-[6px] transition cursor-pointer px-3 py-2 w-[220px]"
            const currentRoute = route.split("/")[3]
            const isCurrentPage =
              currentPath.startsWith(`/admin/dashboard/${currentRoute}`) ||
              (route === "/admin/dashboard" &&
                currentPath === "/admin/dashboard")
            const iconStyle = isCurrentPage ? "brightness-[200]" : ""
            if (isCurrentPage) {
              pageLinkStyle += " text-white bg-[#00B964]"
            } else {
              pageLinkStyle += " hover:bg-[#F8F8F8]"
            }

            return (
              <Link key={index} href={route} className={pageLinkStyle}>
                <Image
                  src={icon}
                  width={18}
                  height={18}
                  alt=""
                  className={iconStyle}
                />
                {title}
                {label && (
                  <span className="bg-[#F9FAFB] text-[0.55rem] whitespace-nowrap font-semibold border border-[#EAECF0] rounded-full px-2 py-0.5 ml-auto">
                    {label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* profile */}
      <div className="flex justify-between border-t border-[#EAECF0] mx-4 pt-6">
        <div className="flex gap-3 pl-2">
          <div className="bg-black/20 w-10 h-10 rounded-full border border-black/10"></div>

          <div className="flex flex-col">
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-sm text-[#475467]">Team Crowdr</p>
          </div>
        </div>

        <div className="pr-2">
          <Image src={LogoutIcon} alt="logout button" />
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
