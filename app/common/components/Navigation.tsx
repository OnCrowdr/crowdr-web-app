"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import MobileMenu from "./MobileMenu"
import { email } from "../../../utils/openEmail"
import "./component-styles/nav.css"
import { Mixpanel } from "../../../utils/mixpanel"

type Props = {
  openModal?: () => void
}

export default function Navigation({ openModal }: Props) {
  const currentPath = usePathname()
  const router = useRouter()

  const isActive = (pathname: string) => {
    return currentPath === pathname ? "active" : ""
  }

  return (
    <nav className="font-satoshi">
      <Link href="/">
        <Image
          src="/svg/new-crowdr-logo.svg"
          alt="crowdr logo"
          width={120}
          height={30}
          className="cursor"
        />
      </Link>

      <ul className="relative md:left-6">
        <li>
          <Link href="/about" className={isActive("/about")}>
            About us
          </Link>
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
        <li>
          <a href={`mailto:${email}`} target="_blank">
            Contact us
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-4 flex-1 max-w-[316px]">
        <button
          className="btn-outline hide-sm flex-1"
          onClick={() => {
            router.push("login")
            Mixpanel.track("Log In Clicked")
          }}
        >
          Log In
        </button>

        <button
          className="btn-primary hide-sm flex-1"
          onClick={() => {
            router.push("signup")
            Mixpanel.track("Sign Up Clicked")
          }}
        >
          Sign Up
        </button>
      </div>
      <MobileMenu openModal={openModal} />
      {/* <Modal isOpen={modalIsOpen} onClose={closeModal}>
       <div>heyyy</div> 
      </Modal> */}
    </nav>
  )
}
