import { useFormContext } from "react-hook-form"
import { useUser, userAtom } from "../../../../../contexts/UserProvider"
import { useToast } from "../../../../../hooks/useToast"
import { Button } from "../../../../../components/Button"
import TextInput from "../../../../../components/TextInput"
import makeRequest from "../../../../../utils/makeRequest"

import ProfileFormContext, { FormFields } from "../utils/useProfileForm"
import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { useAuth } from "@/contexts/AppProvider"
import { UserType } from "@/api/_users/models/PostSignUp"

const ProfileForm = () => {
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext() as ProfileFormContext
  const { user, updateUser } = useAuth()
  const toast = useToast()
  // const setUser = useSetAtom(userAtom)
  const isIndividual = user?.userType === "individual"
  const phoneNumberRegex = /\d{11}/

  useEffect(() => {
    if (user) {
      const { email /*phoneNumber*/ } = user
      const phoneNumber = ""

      const { fullName } = user.userType === UserType.Individual ? user : {}

      const { organizationName } =
        user.userType === UserType.NonProfit ? user : {}

      const fields = {
        email,
        phoneNumber,
        ...(isIndividual ? { fullName } : { organizationName }),
      }
      reset(fields)
    }
  }, [user])

  const submit = async (formFields: FormFields) => {
    if (user) {
      const { userType } = user
      const { fullName, organizationName, phoneNumber } = formFields

      const endpoint = "/settings/edit-profile"
      const headers = {
        "x-auth-token": user.token,
      }

      const payload = {
        userType,
        phoneNumber,
        ...(isIndividual ? { fullName } : { organizationName }),
      }

      try {
        const { success, message } = await makeRequest(endpoint, {
          headers,
          method: "PATCH",
          payload: JSON.stringify(payload),
        })

        if (success) {
          toast({ title: "Well done!", body: message })
          updateUser({
            // phoneNumber,
            ...user,
            ...(user.userType === UserType.Individual
              ? { fullName }
              : { organizationName }),
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="max-w-[484px]">
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col mb-[33px] md:mb-[38px]">
          {isIndividual ? (
            <TextInput
              name="fullName"
              label="Full name"
              styles={{ wrapper: "mb-[26px]" }}
            />
          ) : (
            <TextInput
              name="organizationName"
              label="Organization name"
              styles={{ wrapper: "mb-[26px]" }}
            />
          )}

          <TextInput
            name="phoneNumber"
            label="Phone number"
            styles={{ wrapper: "mb-[26px]" }}
            rules={{
              required: { value: true, message: "Phone number is required" },
              pattern: {
                value: phoneNumberRegex,
                message: "Enter a valid phone number",
              },
            }}
          />

          <TextInput
            name="email"
            label="Email address"
            styles={{ wrapper: "mb-[26px]" }}
            disabled
          />
        </div>

        <div className="flex md:justify-end gap-3">
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
            loading={isSubmitting}
            className="grow md:grow-0 !justify-center"
          />
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
