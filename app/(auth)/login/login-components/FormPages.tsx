import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import _ from "lodash"
import LoginFormContext, { FormFields } from "../../_hooks/useLoginForm"
import SignIn from "./SignIn"
import setUserCookie from "../../../../utils/api/user/setUser"
import { useToast } from "../../../../hooks/useToast"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import { handleUserRedirection } from "../../../../utils/handleUserRedirection"
import makeRequest from "../../../../utils/makeRequest"
import { IUser } from "../../../../utils/api/user/getUser"
import { Mixpanel } from "../../../../utils/mixpanel"
import { setClientSideCookie } from "../../../../utils/cookie-setup"
import { useAuth } from "@/contexts/AppProvider"
import { IPostSignInError } from "@/api/_users/models/PostSignIn"

const FormPages = () => {
  const { handleSubmit } = useFormContext() as LoginFormContext
  const router = useRouter()
  const toast = useToast()
  const { login } = useAuth()

  const submit = async (formFields: FormFields) => {
    const credentials = _.pick(formFields, ["email", "password"])

    try {
      await login(credentials)
    } catch (error: any) {
      const message = extractErrorMessage(error)
      toast({ title: "Oops!", body: message, type: "error" })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <SignIn />
      </form>
    </>
  )
}

export default FormPages
