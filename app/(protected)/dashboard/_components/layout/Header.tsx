"use client"
import Image from "next/image"
import { useUser } from "../../../../../contexts/UserProvider"
import { Button, GrayButton } from "../../../../../components/Button"
import Label from "../Label"
import DrawerTrigger from "../../../../../components/DrawerTrigger"
import DropdownTrigger from "../../../../../components/DropdownTrigger"
import Drawer from "../../../../../components/Drawer"
import Dropdown from "../../../../../components/Dropdown"
import Sidebar from "./Sidebar"
import ProfileSkeleton from "../skeletons/ProfileSkeleton"

import CrowdrLogo from "@/public/images/brand/crowdr-logo.svg"
import PuzzleIcon from "@/public/svg/environment-puzzle.svg"
import BurgerIcon from "@/public/svg/burger-icon.svg"
import Avatar from "@/public/assets/avatar.png"
import CreateCampaignDropdown from "../createCampainDropdown"
import { useAuth } from "@/contexts/AppProvider"
import { UserType } from "@/types"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function getInitials(name?: string) {
  if (!name) return ""
  const nameParts = name.trim().split(" ")
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials
}

const Header = () => {
  const router = useRouter()
  const { user } = useAuth()
  const accountType =
    user?.userType === "individual" ? "Individual" : "Organization"

  const accountName =
    user && user.userType === UserType.Individual
      ? user.fullName
      : user?.organizationName ?? "User"

  return (
    // WARN: touching the z-index may affect z-index of sidebar drawer on mobile
    <header className="flex justify-between items-center w-full bg-white z-[40] min-h-[62px] md:min-h-[74px] border-b-[0.7px] border-[rgba(56, 56, 56, 0.08)] px-[25px]">
      <div>
        <Image
          src={CrowdrLogo}
          alt="crowdr logo"
          className="w-[52px] md:w-[52px]"
        />
      </div>
      <div className="flex items-center">
        <div className="flex mr-6">
          {/* <GrayButton
            text="Setup Guide"
            iconUrl={PuzzleIcon}
            className="hidden md:inline-flex mr-[6px]"
          /> */}
          <CreateCampaignDropdown />
        </div>

        {/* profile */}
        {user ? (
          <Link
            href={`/dashboard/profile`}
            className="group hidden md:flex items-center"
          >
            <div className="mr-[15px]">
              <div className="rounded-full bg-[#00B964] flex flex-row items-center justify-center h-[40px] w-[40px] font-bold text-white font-satoshi">
                {getInitials(accountName)}
              </div>
            </div>
            <div>
              <p>{accountName}</p>
              <Label text={accountType} />
            </div>
          </Link>
        ) : (
          <ProfileSkeleton />
        )}

        {/* burger icon */}
        <DrawerTrigger
          id="sidebar_drawer"
          options={{
            backdropClasses: "bg-[#50556F] bg-opacity-30 fixed inset-0 z-30",
          }}
        >
          <Image
            src={BurgerIcon}
            alt="burger icon"
            className="block md:hidden w-6 md:w-7"
          />
        </DrawerTrigger>
      </div>
      <Drawer id="sidebar_drawer" ariaLabel="Sidebar">
        <Sidebar drawer />
      </Drawer>
    </header>
  )
}

export default Header
