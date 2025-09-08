"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import MobileMenu from "./MobileMenu"
import { email } from "../../../../utils/openEmail"
import "./component-styles/nav.css"
import { Mixpanel } from "../../../../utils/mixpanel"
import { useAuth } from "@/contexts/AppProvider"
import { ChevronDown } from "lucide-react"
import UseCaseDropdown from "./UseCasesDropdown"

type Props = {
  openModal?: () => void
}

export default function Navigation({ openModal }: Props) {
  const currentPath = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const isActive = (pathname: string) => {
    return currentPath === pathname ? "active" : ""
  }

  return (
    <nav className="font-satoshi">
      <Link href="/">
        <Image
          src="/images/brand/crowdr-logo.svg"
          alt="crowdr logo"
          width={70}
          height={30}
          className="cursor w-[55px] md:w-[70px]"
        />
      </Link>

      <ul className="relative md:left-6">
        {/* <li>
          <Link href="/explore" className={isActive("/explore")}>
            Explore
          </Link>
        </li> */}
        <li>
          <Link href="/about" className={isActive("/about")}>
            About
          </Link>
        </li>
        <li>
          <UseCaseDropdown>
            <a className="flex items-center gap-1">
              Use Cases
              <ChevronDown />
            </a>
          </UseCaseDropdown>
        </li>
        <li>
          <a href="https://blog.oncrowdr.com" target="_blank">
            Blog
          </a>
        </li>
        <li>
          <Link href="/pricing" className={isActive("/pricing")}>
            Pricing
          </Link>
        </li>
      </ul>

      {user ? (
        <button
          className="btn-primary hide-sm flex-1 max-w-[160px]"
          onClick={() => {
            router.push("/dashboard")
            Mixpanel.track("'Go To Dashboard' clicked")
          }}
        >
          Go To Dashboard
        </button>
      ) : (
        <div className="flex items-center gap-4 flex-1 max-w-[316px]">
          <button
            className="btn-outline hide-sm flex-1"
            onClick={() => {
              router.push("/login")
              Mixpanel.track("Log In Clicked")
            }}
          >
            Log In
          </button>
          <button
            className="btn-primary hide-sm flex-1"
            onClick={() => {
              router.push("/signup")
              Mixpanel.track("Sign Up Clicked")
            }}
          >
            Sign Up
          </button>
        </div>
      )}

      <MobileMenu openModal={openModal} />
    </nav>
  )
}

