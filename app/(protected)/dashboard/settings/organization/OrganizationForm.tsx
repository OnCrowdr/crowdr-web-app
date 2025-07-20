import { useQuery } from "react-query"
import { useFormContext } from "react-hook-form"
import { useUser } from "../../../../../contexts/UserProvider"
import { useToast } from "../../../../../hooks/useToast"
import NumberInput from "../../../../../components/NumberInput"
import SelectInput from "../../../../../components/SelectInput"
import FileInput from "../../../../../components/FileInput"
import { FileInputContent } from "../../../../../components/FileInput"
import { Button } from "../../../../../components/Button"
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage"
import objectToFormData from "../../../../../utils/objectToFormData"
import makeRequest from "../../../../../utils/makeRequest"
import { keys } from "../../_utils/queryKeys"
import OrganizationFormContext, {
  FormFields,
} from "../utils/useOrganizationForm"
import { Option, stateOptions } from "../../_common/utils/form"

import { Nullable, QF } from "@/types"
import { useAuth } from "@/contexts/AppProvider"
import { UserType } from "@/types"

const OrganizationForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormContext() as OrganizationFormContext
  const { user } = useAuth()
  const toast = useToast()
  const organizationId =
    user?.userType === UserType.NonProfit ? user.organizationId : ""

  const { data: orgDetails, refetch: refetchOrgDetails } = useQuery(
    [keys.settings.organization, user?.token, organizationId],
    fetchOrgDetails,
    {
      enabled: Boolean(user?.token),
      retry: false,
      refetchOnWindowFocus: false,

      onSuccess: (data) => {
        const fields = {
          cacNumber: data?.cacNumber,
          orgLocation: data?.state,
          publicUrl: data?.publicUrl,
        }

        reset(fields)
      },
    }
  )

  const submit = async (formFields: FormFields) => {
    if (user) {
      const { cacNumber, profileImage, orgLocation, publicUrl } = formFields

      const endpoint = `/organizations/${
        orgDetails ? organizationId : "register"
      }`
      const headers = {
        "Content-Type": "multipart/form-data",
        "x-auth-token": user.token,
      }

      const payload = {
        cacNumber,
        state: orgLocation,
        publicUrl,
        ...(profileImage ? { image: profileImage } : {}),
      }

      try {
        const { success, message } = await makeRequest(endpoint, {
          headers,
          method: orgDetails ? "PUT" : "POST",
          payload: objectToFormData(payload),
        })

        if (success) {
          refetchOrgDetails()
          toast({ title: "Well done!", body: message })
        }
      } catch (error) {
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message, type: "error" })
      }
    }
  }

  return (
    <div className="max-w-[484px]">
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col mb-[33px] md:mb-[38px]">
          {/* cac number */}
          <NumberInput
            name="cacNumber"
            label="CAC number"
            disableGroupSeparators
            styles={{ wrapper: "mb-[33px]" }}
          />

          {/* profile image */}
          <FileInput
            config={register("profileImage")}
            styles={{ wrapper: "mb-[20px]" }}
          >
            <FileInputContent
              previewImage={orgDetails?.imageId.url}
              subtext="or drag and drop"
              showPreview
            />
          </FileInput>

          {/* state */}
          <SelectInput
            options={[Option("", "Select a state...", true), ...stateOptions]}
            name="orgLocation"
            label="Where is your organization located?"
            styles={{ wrapper: "mb-[26px]" }}
          />

          {/* public url */}
          <div className="flex flex-col">
            <label
              htmlFor="public_url"
              className="text-[14px] text-[#344054] mb-[6px]"
            >
              Edit your public URL
            </label>
            <div className="grid grid-cols-[146px_minmax(0,_1fr)]">
              <input
                placeholder="oncrowdr.com/"
                disabled
                className="placeholder:text-[#667085] bg-white rounded-tl-lg rounded-bl-lg border border-[#D0D5DD] border-r-0 py-[10px] pl-[14px]"
              />
              <input
                type="text"
                {...register("publicUrl")}
                id="public_url"
                className="text-[15px] rounded-tr-lg rounded-br-lg border border-[#D0D5DD] py-[10px] px-[14px]"
              />
            </div>
          </div>
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

export default OrganizationForm

type Token = Nullable<string>
type ID = Nullable<string>
type Data = Nullable<IOrganization>
const fetchOrgDetails: QF<Data, [Token, ID]> = async ({ queryKey }) => {
  const [_, token, id] = queryKey

  if (token) {
    const endpoint = `/organizations/${id}`
    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<any>(endpoint, {
        headers,
        method: "GET",
      })

      return data
    } catch (error) {
      const message = extractErrorMessage(error)
      throw new Error(message)
    }
  }
}

export interface IOrganization {
  _id: string
  imageId: ImageID
  cacNumber: string
  state: string
  publicUrl: string
  userId: string
  __v: number
}

export interface ImageID {
  _id: string
  url: string
  id: string
}
