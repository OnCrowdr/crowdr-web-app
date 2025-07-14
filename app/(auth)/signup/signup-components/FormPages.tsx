import { useFormContext } from "react-hook-form"
import _ from "lodash"
import { useToast } from "../../../../hooks/useToast"
import { FormFields, RegisterFormContext } from "../utils/useRegisterForm"

import Intro from "./Intro"
import AccountDetails from "./AccountDetails"
import { useRouter } from "next/navigation"
import setUserCookie from "../../../../utils/api/user/setUser"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import makeRequest from "../../../../utils/makeRequest"
import { IUser } from "../../../../utils/api/user/getUser"
import { Mixpanel } from "../../../../utils/mixpanel"
import { setClientSideCookie } from "../../../../utils/cookie-setup"
import { useMutation } from "react-query"
import _users from "@/api/_users"

const FormPages = () => {
  const { formPage, handleSubmit } = useFormContext() as RegisterFormContext
  const toast = useToast()
  const router = useRouter()

  const signupMutation = useMutation(_users.signup)

  const submit = async (formFields: FormFields) => {
    const sanitizedFields = _.pick(formFields, [
      "userType",
      "email",
      "phoneNumber",
      "interests",
      "password",
      "referrer",
      "organizationName",
      "fullName",
      "gender",
    ])

    try {
      const res = await signupMutation.mutateAsync(sanitizedFields)
      router.push(`/confirmation?email=${res.data.email}`)
      toast({ title: "Welcome!", body: res.message })
    } catch (error) {
      const message = extractErrorMessage(error)
      Mixpanel.track("Signup Error")
      toast({ title: "Oops!", body: message, type: "error" })
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      {formPage == "intro" && <Intro />}
      {formPage == "account" && <AccountDetails />}
    </form>
  )
}

export default FormPages
