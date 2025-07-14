"use server"
import { revalidateTag } from "next/cache"
import { userTag } from "@/utils/tags"
import { extractErrorMessage } from "@/utils/extractErrorMessage"
import makeRequest from "@/utils/makeRequest"
import objectToFormData from "@/utils/objectToFormData"
import { FormFields } from "../utils/useOrganizatonForm"
import { after } from "next/server"

export async function registerOrganizationAction(
  formFields: FormFields,
  token: string
) {
  try {
    const endpoint = "/organizations/register"
    const payload = { ...formFields, image: formFields.image[0] }

    const headers = {
      "Content-Type": "multipart/form-data",
      "x-auth-token": token,
    }

    const { success, message } = await makeRequest<{
      success: boolean
      message: string
    }>(endpoint, {
      headers,
      method: "POST",
      payload: objectToFormData(payload),
    })

    after(() => {
      // Revalidate user data after organization gets attached to user
      revalidateTag(userTag)
    })

    return { success, message }
  } catch (error) {
    const message = extractErrorMessage(error)
    return { success: false, error: message }
  }
}
