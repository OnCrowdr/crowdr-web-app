import { useFormContext } from "react-hook-form"
import _ from "lodash"
import LoginFormContext, { FormFields } from "../../_hooks/useLoginForm"
import ResetPassword from "./ResetPassword"
import { useToast } from "../../../../hooks/useToast"
import makeRequest from "../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import { useRouter, useSearchParams } from "next/navigation"

const FormPages = () => {
  const { handleSubmit } = useFormContext() as LoginFormContext
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  const toast = useToast()
  const submit = async (formFields: FormFields) => {
    const endpoint = "/users/reset-password"
    let payload = JSON.stringify(_.pick(formFields, ["password"]))

    const headers = { "x-auth-token": token! }
    try {
      const { message } = await makeRequest<{ message: string }>(endpoint, {
        headers,
        method: "POST",
        payload,
      })
      toast({ title: "Success!", body: message, type: "success" })
      router.push("/login")
    } catch (error) {
      const message = extractErrorMessage(error)
      toast({ title: "Oops!", body: message, type: "error" })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <ResetPassword />
      </form>
    </>
  )
}

export default FormPages
