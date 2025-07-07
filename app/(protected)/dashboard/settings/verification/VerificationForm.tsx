import { useQuery } from "react-query"
import { useFormContext } from "react-hook-form"
import { useUser } from "../../../../../contexts/UserProvider"
import { useToast } from "../../../../../hooks/useToast"
import TextInput from "../../../../../components/shared/TextInput"
import SelectInput from "../../../../../components/shared/SelectInput"
import FileInput from "../../../../../components/shared/FileInput"
import { FileInputContent } from "../../../../../components/shared/FileInput"
import { Button } from "../../../../../components/shared/Button"
import { extractErrorMessage } from "../../../../../utils/extractErrorMessage"
import objectToFormData from "../../../../../utils/objectToFormData"
import makeRequest from "../../../../../utils/makeRequest"
import { keys } from "../../_utils/queryKeys"
import { Option } from "../../_common/utils/form"
import VerificationFormContext, {
  FormFields,
} from "../utils/useVerificationForm"

import { QF } from "@/types"

const VerificationForm = () => {
  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormContext() as VerificationFormContext
  const user = useUser()
  const toast = useToast()

  const { data: customerDetails, refetch: refetchCustomerDetails } = useQuery(
    [keys.settings.kyc, user?.token],
    fetchKyc,
    {
      enabled: Boolean(user?.token),
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const fields = {
          bvnNumber: data?.BVN,
          docType: data?.docType,
        }

        reset(fields)
      },
    }
  )

  const submit = async (formFields: FormFields) => {
    if (user) {
      const {
        // bvnNumber,
        docType,
        docImg,
        selfieImg,
      } = formFields

      const endpoint = "/settings/KYC"
      const headers = {
        "Content-Type": "multipart/form-data",
        "x-auth-token": user.token,
      }

      const payload = {
        // BVN: bvnNumber,
        docType,
        ...(docImg ? {docImg: docImg[0]} : {}),
        ...(selfieImg ? {selfieImg: selfieImg[0]} : {}),
      }

      try {
        const { success, message } = await makeRequest(endpoint, {
          headers,
          method: "PUT",
          payload: objectToFormData(payload),
        })

        if (success) {
          refetchCustomerDetails()
          toast({ title: "Well done!", body: message })
        }
      } catch (error) {
        const message = extractErrorMessage(error)
        toast({ title: "Oops!", body: message, type: "error" })
      }
    }
  }

  const verificationDocument = verificationOptions.find(
    (option) => option.value === watch("docType")
  )?.label

  return (
    <div className="max-w-[484px]">
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col mb-[33px] md:mb-[38px]">
          {/* <TextInput
            name="bvnNumber"
            label="BVN number"
            styles={{ wrapper: "mb-[33px]" }}
            rules={
              customerDetails
                ? undefined
                : {
                    required: "BVN is required",
                    pattern: {
                      value: /^\d{11}$/,
                      message: "Enter a valid BVN number",
                    },
                  }
            }
          /> */}

          <SelectInput
            name="docType"
            label="Verification type"
            options={verificationOptions}
            rules={
              customerDetails
                ? undefined
                : {
                    required: "Verification type is required",
                  }
            }
            styles={{ wrapper: "mb-[26px]" }}
          />

          <FileInput
            name="docImg"
            styles={{ wrapper: "mb-[50px]" }}
            disabled={!Boolean(verificationDocument)}
            rules={
              customerDetails
                ? undefined
                : {
                    required: "Document is required",
                  }
            }
          >
            <FileInputContent
              previewImage={customerDetails?.docImg.url}
              subtext={verificationDocument || "or drag and drop"}
              showPreview
            />
          </FileInput>

          <div>
            <p className="font-medium text-[#344054] mb-[6px]">
              Upload a photo of yourself
            </p>

            <hr className="mb-5" />

            <FileInput
              name="selfieImg"
              styles={{ wrapper: "mb-[20px]" }}
              rules={
                customerDetails
                  ? undefined
                  : {
                      required: "Selfie is required",
                    }
              }
            >
              <FileInputContent
                previewImage={customerDetails?.selfieImg.url}
                subtext="or drag and drop"
                showPreview
              />
            </FileInput>
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

export default VerificationForm

const verificationOptions = [
  Option("", "Select a verification type...", true),
  Option("drivers_license", "Driver's license"),
  Option("voters_card", "Voter's card"),
  Option("international_passport", "International passport"),
  Option("nin_card", "NIN card"),
]

const fetchKyc: QF<Kyc | undefined, [string | undefined]> = async ({
  queryKey,
}) => {
  const [_, token] = queryKey

  if (token) {
    const endpoint = `/settings/KYC`
    const headers = {
      "x-auth-token": token,
    }

    try {
      const { data } = await makeRequest<Kyc>(endpoint, {
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

export interface Kyc {
  _id: string
  userId: string
  BVN: string
  docType: string
  docImg: Img
  selfieImg: Img
  verificationStatus: string
  createdAt: string
  updatedAt: string
}

export interface Img {
  url: string
}
