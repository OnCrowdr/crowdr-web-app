"use client"
import { revalidate } from "../../../../../utils/api/revalidate"
import { getUser } from "../../../../../utils/api/user/getUser"
import OldButton from "../../../../../components/shared/OldButton"
import { useToast } from "../../../../../hooks/useToast"
import { userTag } from "../../../../../utils/tags"
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage"
import makeRequest from "../../../../../utils/makeRequest"
import { useState } from "react"
import { useMutation } from "react-query"
import _users from "@/api/_users"
import { useSearchParams } from "next/navigation"

export default function ResendConfirmationEmail() {
  const toast = useToast()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const resendMutation = useMutation(_users.resendVerificationLink)

  const resendEmail = async () => {
    if (email) {
      try {
        const res = await resendMutation.mutateAsync({ email })
        toast({ title: "Success!", body: res.message, type: "success" })
      } catch (error) {
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message, type: "error" })
      }
    } else {
      toast({ title: "Email not found" })
    }
  }

  return (
    <>
      <OldButton
        type="button"
        text="Resend confirmation email"
        isSubmitting={resendMutation.isLoading}
        className="mb-[21px] mt-[15px]"
        onClick={resendEmail}
      />
    </>
  )
}
