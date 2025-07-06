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

const FormPages = () => {
  const { handleSubmit } = useFormContext() as LoginFormContext
  const router = useRouter()
  const toast = useToast()

  const submit = async (formFields: FormFields) => {
    Mixpanel.track("Login clicked")
    const endpoint = "/users/signin"
    let payload = JSON.stringify(_.pick(formFields, ["email", "password"]))

    try {
      const { data: user } = await makeRequest<IUser>(endpoint, {
        method: "POST",
        payload,
      })

      const { token } = user
      if (token) {
        // Set server-side cookie
        await setUserCookie(token);
        setClientSideCookie("token", token, 7); 
      }
      handleUserRedirection(user, router.push)
    } catch (error) {
      Mixpanel.track("Login failed")
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
