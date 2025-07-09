"use server"
import { revalidateTag } from "next/cache"
import { userTag } from "../../../../tags"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import makeRequest from "../../../../utils/makeRequest"
import { after } from "next/server"

export async function resendVerificationAction(token: string) {
  try {
    const endpoint = `/users/resend-verification-link`
    const headers = {
      "x-auth-token": token,
    }

    const data = await makeRequest<{ message: string }>(endpoint, {
      headers,
      method: "POST",
      cache: "no-store",
    })

    after(() => {
      // Revalidate the user tag
      revalidateTag(userTag)
    })

    return { success: true, message: data.message }
  } catch (error: any) {
    const message = extractErrorMessage(error)
    return { success: false, error: message }
  }
}
