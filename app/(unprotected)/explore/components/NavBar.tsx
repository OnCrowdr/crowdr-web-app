"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { email } from "../../../../utils/openEmail"
import "./nav.css"
import { useAuth } from "@/contexts/AppProvider"

type Props = {
  openModal?: () => void
}

export default function NavBar() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <nav>
      <Link href="/">
        <Image
          src="/svg/new-crowdr-logo.svg"
          alt="crowdr logo"
          width={120}
          height={30}
          className="cursor"
        />
      </Link>

      <div className="flex flex-row items-center gap-2">
        {isAuthenticated ? (
          <button
            className="btn-primary !rounded-[8px] !py-2.5 !px-4"
            onClick={() => {
              router.push("/dashboard")
            }}
          >
            Go to dashboard
          </button>
        ) : (
          <>
            <button
              className="btn-outline !rounded-[8px] !py-2.5 !px-4 hide-sm"
              onClick={() => {
                router.push("/login")
              }}
            >
              Sign in
            </button>
            <button
              className="btn-primary !rounded-[8px] !py-2.5 !px-4"
              onClick={() => {
                router.push("/signup")
              }}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
