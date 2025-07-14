"use client"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import {
  FormFields,
  OrganizationFormContext,
} from "../utils/useOrganizatonForm"
import { useToast } from "../../../../../hooks/useToast"
import OrganizationDetails from "./OrganizationDetails"
import { getUser } from "@/utils/api/user/getUser"
import { extractErrorMessage } from "@/utils/extractErrorMessage"
import { registerOrganizationAction } from "./actions"

const FormPage = () => {
  const { handleSubmit } = useFormContext() as OrganizationFormContext
  const router = useRouter()
  const toast = useToast()

  const submit = async (formFields: FormFields) => {
    try {
      const user = await getUser()
      
      // Call the server action
      const result = await registerOrganizationAction(formFields, user?.token!)
      
      if (result.success) {
        toast({ title: "Success!", body: result.message, type: "success" })
        router.replace("/dashboard")
      } else {
        toast({ title: "Oops!", body: result.error, type: "error" })
      }
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