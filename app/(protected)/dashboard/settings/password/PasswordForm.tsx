import { useFormContext } from "react-hook-form"
import { useUser } from "../../../../../contexts/UserProvider"
import { useToast } from "../../../../../hooks/useToast"
import InputTitle from "../../../../../components/shared/InputTitle"
import { Button } from "../../../../../components/shared/Button"
import PasswordFormContext, { FormFields } from "../utils/usePasswordForm"
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage"
import makeRequest from "../../../../../utils/makeRequest"
import PasswordInput from "../../../../../components/shared/PasswordInput"

const PasswordForm = () => {
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormContext() as PasswordFormContext
  const user = useUser()
  const toast = useToast()

  const submit = async (formFields: FormFields) => {
    if (user) {
      const { currentPassword, newPassword } =
        formFields

      const endpoint = "/settings/change-password"
      const headers = {
        "x-auth-token": user.token,
      }

      const payload = {
        oldPassword: currentPassword,
        newPassword
      }

      try {
        const { success, message } = await makeRequest(endpoint, {
          headers,
          method: "PATCH",
          payload: JSON.stringify(payload)
        })

        if (success) {
          reset()
          toast({ title: "Well done!", body: message })
        }
      } catch (error) {
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message, type: "error" })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-[824px]">
      <div className="flex flex-col gap-5 mb-[263px] md:mb-[52px]">
        <div className="flex flex-col md:flex-row justify-between gap-y-[9px] gap-x-[25px]">
          <InputTitle
            title="Current password"
            styles={{ wrapper: "md:w-[280px]" }}
          />
          <PasswordInput
            name="currentPassword"
            rules={{
              required: "Current password is required",
            }}
            ariaLabel="Current password"
            styles={{ wrapper: "grow" }}
          />
        </div>

        <hr />

        <div className="flex flex-col md:flex-row justify-between gap-y-[9px] gap-x-[25px]">
          <InputTitle
            title="New password"
            styles={{ wrapper: "md:w-[280px]" }}
          />
          <PasswordInput
            name="newPassword"
            rules={{
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Your new password must be more than 8 characters.",
              },
            }}
            ariaLabel="New password"
            styles={{ wrapper: "grow" }}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-y-[9px] gap-x-[25px]">
          <InputTitle
            title="Confirm new password"
            styles={{ wrapper: "md:w-[280px]" }}
          />
          <PasswordInput
            name="confirmPassword"
            rules={{
              required: "Confirm password is required",
              validate: {
                value: (confirmPassword, { newPassword }) =>
                  confirmPassword === newPassword || "Passwords do not match",
              },
            }}
            ariaLabel="Confirm new password"
            styles={{ wrapper: "grow" }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-end gap-3">
        <Button
          href="/explore"
          text="Cancel"
          textColor="#344054"
          bgColor="white"
          outlineColor="#D0D5DD"
          className="grow md:grow-0 !justify-center"
        />
        <Button
          text="Save changes"
          buttonType="submit"
          disabled={isSubmitting}
          className="grow md:grow-0 !justify-center"
        />
      </div>
    </form>
  )
}

export default PasswordForm
