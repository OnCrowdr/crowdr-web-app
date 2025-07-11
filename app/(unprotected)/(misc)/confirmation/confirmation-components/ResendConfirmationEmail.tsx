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

  const resendMutation = useMutation({
    mutationFn: _users.resendVerificationLink,
    onSuccess: (res) => {
      toast({ title: "Success!", body: res.message, type: "success" })
    },
    onError: (err) => {
      const message = extractErrorMessage(err)
      toast({ title: "Oops!", body: message, type: "error" })
    },
  })

  const [isSubmitting, setSubmitting] = useState(false)
  // const resendEmail = async () => {
  //   try {
  //     setSubmitting(true)
  //     const user = (await getUser())!
  //     const endpoint = `/users/resend-verification-link`

  //     const headers = {
  //       // certain that token should be defined here, cause their is middleware protecting this route
  //       "x-auth-token": user.token!,
  //     }

  //     const data = await makeRequest<{ message: string }>(endpoint, {
  //       headers,
  //       method: "GET",
  //       cache: "no-store",
  //     })
  //     revalidate(userTag)
  //     toast({ title: "Success!", body: data.message, type: "success" })
  //   } catch (error: any) {
  //     const message = extractErrorMessage(error)
  //     toast({ title: "Oops!", body: message, type: "error" })
  //   }
  //   setSubmitting(false)
  // }

  const resendEmail = () => {
    if (email) {
      resendMutation.mutate({ email })
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
