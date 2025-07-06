"use client"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import {
  FormFields,
  OrganizationFormContext,
} from "../utils/useOrganizatonForm"
import { useToast } from "../../../../../hooks/useToast"
import OrganizationDetails from "./OrganizationDetails"
import { getUser } from "../../../../../utils/api/user/getUser"
import makeRequest from "../../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage"
import objectToFormData from "../../../../../utils/objectToFormData"
import { userTag } from "../../../../../utils/tags"
import { revalidate } from "../../../../../utils/api/revalidate"

const FormPage = () => {
  const { handleSubmit } = useFormContext() as OrganizationFormContext
  const router = useRouter()
  const toast = useToast()

  const submit = async (formFields: FormFields) => {
    const endpoint = "/organizations/register"
    const payload = { ...formFields, image: formFields.image[0] }

    try {
      const user = await getUser()
      const headers = {
        "Content-Type": "multipart/form-data",
        "x-auth-token": user?.token!,
      }
      const { success, message } = await makeRequest<{
        success: boolean
        message: string
      }>(endpoint, {
        headers,
        method: "POST",
        payload: objectToFormData(payload),
      })

      revalidate(userTag) // revalidate user data after organization gets attached to user
      toast({ title: "Success!", body: message, type: "success" })
      if (success) router.replace("/explore")
    } catch (error) {
      const message = extractErrorMessage(error)
      toast({ title: "Oops!", body: message, type: "error" })
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <OrganizationDetails />
    </form>
  )
}

export default FormPage
