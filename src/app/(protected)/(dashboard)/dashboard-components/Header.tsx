"use client"
import Image from "next/image"
import { useUser } from "../common/hooks/useUser"
import { Button, GrayButton } from "../../../common/components/Button"
import Label from "./Label"
import DrawerTrigger from "../../../common/components/DrawerTrigger"
import DropdownTrigger from "../../../common/components/DropdownTrigger"
import Drawer from "../../../common/components/Drawer"
import Dropdown from "../../../common/components/Dropdown"
import Sidebar from "./Sidebar"
import ProfileSkeleton from "./skeletons/ProfileSkeleton"

import CrowdrLogo from "../../../../../public/images/brand/crowdr-logo.svg"
import PuzzleIcon from "../../../../../public/svg/environment-puzzle.svg"
import BurgerIcon from "../../../../../public/svg/burger-icon.svg"
import Avatar from "../../../../../public/assets/avatar.png"

export  function getInitials(name: string) {
  if (!name) return ''; 
  const nameParts = name.trim().split(' ');
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');

  return initials;
}

const Header = () => {
  const user = useUser()
  const accountType =
    user?.userType === "individual" ? "Individual" : "Organization"

  
  return (
    <header className="flex justify-between items-center w-full min-h-[62px] md:min-h-[74px] border-b-[0.7px] border-[rgba(56, 56, 56, 0.08)] px-[25px]">
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
          <Button
            text="Create Campaign"
            href="/campaigns/create-or-edit-campaign"
          />
        </div>

        {/* profile */}
        {user ? (
          <div className="hidden md:flex items-center">
            <div className="mr-[15px]">
              <div className="rounded-full bg-[#00B964] flex flex-row items-center justify-center h-[40px] w-[40px] font-bold text-white font-satoshi">
                {getInitials(user.fullName || user.organizationName)}
              </div>
            </div>
            <div>
              <p>{user.fullName || user.organizationName}</p>
              <Label text={accountType} />
            </div>
          </div>
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
