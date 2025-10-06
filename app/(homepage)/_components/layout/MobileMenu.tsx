"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { IoMdMenu, IoMdClose } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { email } from "../../../../utils/openEmail"
import "./component-styles/mobile-menu.css"
import { cn } from "@/utils/style"
import { useAuth } from "@/contexts/AppProvider"
import MenuItem from "./MenuItem"
import { useCases } from "./UseCasesDropdown"
import { learnItems } from "./LearnDropdown"

type Props = {
  openModal?: () => void
}

export default function MobileMenu({ openModal }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const currentPath = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const isActive = (pathname: string) => {
    return currentPath === pathname ? "active" : ""
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const props = {
    onClick: closeMenu,
  }

  return (
    <div className="mobile-menu">
      <div className="container">
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? (
            <IoMdClose size={25} />
          ) : (
            <Image width={25} height={25} src="/svg/new-menu.svg" alt="menu" />
          )}
        </div>
      </div>
      <div className={cn("menu z-10", isOpen && "open shadow-md")}>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <MenuItem item={item} onLinkClick={closeMenu} />
            </li>
          ))}

          {!isAuthenticated ? (
            <>
              <li>
                <MenuItem
                  item={{
                    label: "Login",
                    href: "/login",
                  }}
                  onLinkClick={closeMenu}
                />
              </li>
              <li>
                <Link href="/signup" {...props}>
                  <button className="btn-outline w-100">
                    Start a Campaign
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <li className="mt-5">
              <Link href={"/dashboard"} {...props}>
                <button className="btn-outline w-100">Go To Dashboard</button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

const items = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Use Cases",
    children: useCases,
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Learn",
    children: learnItems,
  },
  {
    label: "Blog",
    href: "https://blog.oncrowdr.com",
    external: "_blank" as const,
  },
]
