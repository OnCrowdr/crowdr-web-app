import { useForm, FormProvider } from "react-hook-form"
import { UseFormReturn } from "react-hook-form/dist/types"

import { RFC } from "@/types"
import { CampaignCategory } from "../../../../../../../utils/campaignCategory"
import {
  // CampaignType,
  ICampaign,
  IFundraiseVolunteerCampaign,
} from "@/types/Campaign"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import { useQuery } from "react-query"
import { mapResponseToForm } from "../../../../_components/CampaignForm"
import { extractErrorMessage } from "../../../../../../../utils/extractErrorMessage"
import makeRequest from "../../../../../../../utils/makeRequest"
import { useUser } from "../../../../../../../contexts/UserProvider"
import { useRouter } from "next/navigation"
import { useToast } from "../../../../../../../hooks/useToast"
import { Mixpanel } from "../../../../../../../utils/mixpanel"
import objectToFormData from "../../../../../../../utils/objectToFormData"
import kycService from "../../../../_common/services/kycService"
import CompletionCard from "../../../../_components/CompletionCard"
import { useModal } from "../../../../../../../hooks/useModal"
import { shareCampaignModalAtom } from "../../../../_utils/atoms"
import { useSetAtom } from "jotai"
import CampaignPreview from "./CampaignPreview"
import { regex } from "regex"
import FormSkeleton from "../../../../_components/skeletons/FormSkeleton"
import { CampaignType } from "../../../../../admin/common/services/campaign/models/GetCampaigns"

// export const CampaignContext = createContext({} as CampaignFormContext)

const CampaignProvider: RFC<Props> = ({ children, campaignId }) => {
  const form = useForm<FormFields>(config)
  const user = useUser()
  const router = useRouter()
  const modal = useModal()
  const toast = useToast()
  const isEdit = Boolean(campaignId)
  const setShareCampaignModal = useSetAtom(shareCampaignModalAtom)
  const [campaignType, setCampaignType] = useState<CampaignType>()
  const [campaignForm, setCampaignForm] = useState<CampaignForm>()
  const [showPreview, setShowPreview] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  useEffect(() => {
    const initCampaignForm = (campaignType: CampaignType) => {
      if (campaignType === "volunteer") {
        setCampaignForm("volunteer")
      } else {
        setCampaignForm("fundraise")
      }
    }

    if (user && campaignId) {
      const fetchCampaignData = async () => {
        try {
          const endpoint = `/my-campaigns/${campaignId}`
          const headers = {
            "Content-Type": "multipart/form-data",
            "x-auth-token": user.token,
          }

          const { data } = await makeRequest<IFundraiseVolunteerCampaign>(
            endpoint,
            {
              headers,
              method: "GET",
            }
          )

          const coverImage = data.campaignCoverImage.url
          const additionImages = data.campaignAdditionalImages.map(
            (image) => image.url
          )
          setUploadedImages([coverImage, ...additionImages])

          const formData = mapResponseToForm(data)
          form.reset(formData)
          form.setValue("campaignDuration", formData.campaignDuration!)
          setCampaignType(data.campaignType)
          initCampaignForm(data.campaignType)
          // setFormFetched(true)
        } catch (error) {
          const message = extractErrorMessage(error)
          toast({ title: "Oops!", body: message, type: "error" })
          router.back()
        }
      }

      fetchCampaignData()
    } else {
      const currentUrl = window.location.href
      const url = new URL(currentUrl)
      const queryParams = url.searchParams
      const typeParam = queryParams.get("type") as CampaignType
      const campaignType = [
        CampaignType.Fundraise,
        CampaignType.Volunteer,
        CampaignType.FundraiseVolunteer,
      ].includes(typeParam)
        ? typeParam
        : CampaignType.Fundraise
      setCampaignType(campaignType)
      initCampaignForm(campaignType)
    }
  }, [user])

  const submit = async (formFields: FormFields) => {
    Mixpanel.track("Create campaign clicked")
    const {
      category,
      campaignImages,
      title,
      story,
      // campaignType,
      skillsNeeded,
      otherSkillsNeeded,
      currency,
      fundingGoal,
      campaignDuration,
      ageRange,
      genderPreference,
      timeCommitment,
      volunteerCommitment,
      additionalNotes,
    } = formFields
    const isFundraiseRelated = campaignType
      ?.toLowerCase()
      ?.includes("fundraise")
    const isVolunteerRelated = campaignType
      ?.toLowerCase()
      ?.includes("volunteer")
    const isIndividual = user?.userType == "individual"

    const payload: any = {
      title,
      category,
      story,
      campaignType: isIndividual ? CampaignType.Fundraise : campaignType,
      campaignStartDate: campaignDuration[0].toISOString(),
      campaignEndDate: campaignDuration[1].toISOString(),
      // campaignStartDate: new Date(
      //   campaignDuration[0] as any as Date
      // ).toISOString(),
      // campaignEndDate: new Date(
      //   campaignDuration[1] as any as Date
      // ).toISOString(),
    }

    if (campaignImages) {
      payload.campaignCoverImage = campaignImages[0]

      if (campaignImages.length > 1) {
        payload.campaignAdditionalImages = campaignImages.slice(1)
      }
    }

    if (isFundraiseRelated || isIndividual) {
      // TODO: MAKE objectToFormData handle converting nested objects to JSON
      payload.fundraise = JSON.stringify({
        fundingGoalDetails: [
          {
            amount: fundingGoal,
            currency,
          },
        ],
      })
    }

    if (isVolunteerRelated) {
      payload.volunteer = JSON.stringify({
        skillsNeeded,
        otherSkillsNeeded,
        ageRange,
        genderPreference,
        commitementStartDate: timeCommitment[0],
        commitementEndDate: timeCommitment[1],
        requiredCommitment: volunteerCommitment,
        additonalNotes: additionalNotes,
        volunteersNeeded: Number(formFields.volunteerCount),
        address: formFields.campaignAddress,
        phoneNumber: formFields.phoneNumber,
        email: formFields.contactEmail,
      })
    }

    const shareCampaign = async (campaign: ICampaign) => {
      modal.hide()
      setShareCampaignModal({ isOpen: true, campaign })
    }

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        "x-auth-token": user?.token!,
      }
      const endpoint = isEdit ? `/campaigns/${campaignId}` : "/campaigns"

      const { success, message, data } = await makeRequest<ICampaign>(
        endpoint,
        {
          headers,
          method: isEdit ? "PUT" : "POST",
          payload: objectToFormData(payload),
          extractError: false,
        }
      )

      if (success) {
        switch (true) {
          case isFundraiseRelated && isVolunteerRelated:
            Mixpanel.track("Donation and Volunteer Campaign created")
            break
          case isFundraiseRelated:
            Mixpanel.track("Donation Campaign created")
            break
          case isVolunteerRelated:
            Mixpanel.track("Volunteer Campaign created")
            break
        }

        router.push("/campaigns")

        try {
          await kycService.getKyc({ userToken: user?.token || "" })
        } catch (error) {
          modal.show(
            <CompletionCard
              title="Complete campaign setup!"
              text="Upload your identity verification info in settings to finish creating your campaign."
              primaryButton={{
                label: "Upload KYC",
                onClick: () => {
                  router.push("/dashboard/settings/verification")
                  modal.hide()
                },
              }}
              secondaryButton={{ label: "Cancel", onClick: modal.hide }}
              clearModal={modal.hide}
              icon={
                <div className="grid place-items-center rounded-full bg-[#FEF0C7] p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z"
                      stroke="#FFC328"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              }
            />
          )
        }

        if (isEdit) {
          toast({ title: "Well done!", body: message })
        } else {
          modal.show(
            <CompletionCard
              title="Campaign created successfully"
              text="This campaign has been created successfully. You will be able to edit this campaign and republish changes."
              primaryButton={{
                label: "Share on your Socials",
                onClick: () => shareCampaign(data),
              }}
              secondaryButton={{ label: "Cancel", onClick: modal.hide }}
              clearModal={modal.hide}
            />
          )
        }
      }
    } catch (error: any) {
      Mixpanel.track("Campaign creation error")
      const message = extractErrorMessage(error)

      if (Array.isArray(message)) {
        for (let msg of message) {
          toast({ title: "Oops!", body: msg, type: "error" })
        }
      } else {
        toast({ title: "Oops!", body: message, type: "error" })
      }
    }
  }

  const formContext: CampaignFormContext = {
    isEdit,
    campaignType,
    campaignForm,
    showPreview,
    uploadedImages,
    setShowPreview,
    setCampaignForm,
    submitForm: form.handleSubmit(submit),
    ...form,
  }

  if (campaignId && !form.getValues().title) {
    return <FormSkeleton />
  }

  return (
    <FormProvider {...formContext}>
      {children}
      <CampaignPreview />
    </FormProvider>
  )
}

export default CampaignProvider

interface Props {
  campaignId?: string
}

export type { CampaignProvider, FormFields }

const config: UseFormConfig = {
  defaultValues: {
    title: "",
    category: "" as any,
    campaignType: "" as any,
    story: "",
    currency: "",
    skillsNeeded: [],
    ageRange: "",
    genderPreference: "",
    volunteerCommitment: "",
    additionalNotes: "",
    volunteerCount: 0,
    campaignAddress: "",
    contactEmail: "",
  },
  mode: "onChange",
}

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0]
type FormFields = {
  title: string
  category: CampaignCategory
  campaignType: CampaignType
  story: string
  currency: string
  fundingGoal: number
  campaignDuration: [Date, Date]
  campaignImages?: File[]
  skillsNeeded: string[]
  otherSkillsNeeded: string
  ageRange: string
  genderPreference: string
  timeCommitment: [string, string]
  volunteerCommitment: string
  additionalNotes: string
  volunteerCount: number
  campaignAddress: string
  phoneNumber: string
  contactEmail: string
}
// type CampaignFormProvider = UseFormReturn<FormFields>

type CampaignForm = "fundraise" | "volunteer"
export type CampaignFormContext = {
  campaignType: CampaignType | undefined
  campaignForm: CampaignForm | undefined
  showPreview: boolean
  uploadedImages: string[]
  setShowPreview: Dispatch<SetStateAction<boolean>>
  setCampaignForm: Dispatch<SetStateAction<CampaignForm | undefined>>
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>
  isEdit: boolean
} & UseFormReturn<FormFields>
