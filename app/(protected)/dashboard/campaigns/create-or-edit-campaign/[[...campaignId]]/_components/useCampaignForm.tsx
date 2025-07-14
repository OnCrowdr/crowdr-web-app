import { useForm, FormProvider } from "react-hook-form"
import { UseFormReturn } from "react-hook-form/dist/types"

import { RFC } from "@/types"
import { CampaignCategory } from "../../../../../../../utils/campaignCategory"
import {
  IBaseCampaign,
  ICampaign,
} from "@/types/Campaign"
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import { useMutation, useQuery } from "react-query"
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
import { useAuth } from "@/contexts/AppProvider"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import query from "@/api/query"
import _my_campaigns from "@/api/_my_campaigns"
import _campaigns from "@/api/_campaigns"
import _settings from "@/api/_settings"
import { Campaign } from "@/api/_campaigns/models/GetCampaigns"

const CampaignProvider: RFC<Props> = ({ children, campaignId }) => {
  const form = useForm<FormFields>(config)
  const { user } = useAuth()
  const router = useRouter()
  const modal = useModal()
  const toast = useToast()
  const isEdit = Boolean(campaignId)
  const setShareCampaignModal = useSetAtom(shareCampaignModalAtom)
  const [campaignType, setCampaignType] = useState<CampaignType>()
  const [campaignForm, setCampaignForm] = useState<CampaignForm>()
  const [showPreview, setShowPreview] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Fix 1: Move mutations to component level
  const createMutation = useMutation({
    mutationFn: (data: FormData) => {
      return _campaigns.createCampaign(data)
    },
    onSuccess: (response) => {
      handleMutationSuccess(response, false)
    },
    onError: (error) => {
      handleMutationError(error)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string, data: FormData }) => {
      return _campaigns.updateCampaign({ campaignId }, data)
    },
    onSuccess: (response) => {
      handleMutationSuccess(response, true)
    },
    onError: (error) => {
      handleMutationError(error)
    }
  })

  const campaignQuery = useAuthQuery({
    queryKey: [query.keys.MY_CAMPAIGN, campaignId],
    queryFn: () => {
      if (!campaignId) {
        throw new Error('Campaign ID is required to fetch campaign data')
      }
      return _my_campaigns.getCampaign({ campaignId })
    },
    enabled: !!campaignId && isEdit,
    onError: (error) => {
      console.error('Failed to fetch campaign:', error)
      toast({ 
        title: "Error", 
        body: "Failed to load campaign data", 
        type: "error" 
      })
    }
  })
  const campaign = campaignQuery.data


  useEffect(() => {
    
    const initCampaignForm = (campaignType: CampaignType) => {
      if (campaignType === "volunteer") {
        setCampaignForm("volunteer")
      } else {
        setCampaignForm("fundraise")
      }
    }

    if (isEdit) {
      if (campaign) {
        const coverImage = campaign.campaignCoverImage.url
        const additionImages = campaign.campaignAdditionalImages.map(
          (image) => image.url
        )

        setUploadedImages([coverImage, ...additionImages])
        const formData = mapResponseToForm(campaign)
        form.reset(formData)
        form.setValue("campaignDuration", formData.campaignDuration!)
        setCampaignType(campaign.campaignType)
        initCampaignForm(campaign.campaignType)
        
      }

      if (campaignQuery.error) {
        console.error('Campaign query error:', campaignQuery.error) // Debug log
      }
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
  }, [campaign, campaignId, isEdit])

  // Fix 2: Separate success and error handlers
  const handleMutationSuccess = async (response: any, isEdit: boolean) => {
    const isFundraiseRelated = campaignType?.toLowerCase()?.includes("fundraise")
    const isVolunteerRelated = campaignType?.toLowerCase()?.includes("volunteer")

    // Track analytics
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

    // Handle KYC check
    try {
      await _settings.getKyc()
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          }
        />
      )
    }

    // Handle completion modal
    if (isEdit) {
      toast({ title: "Well done!", body: response.message })
    } else {
      const shareCampaign = async (campaign: Campaign) => {
        modal.hide()
        setShareCampaignModal({ isOpen: true, campaign })
      }

      modal.show(
        <CompletionCard
          title="Campaign created successfully"
          text="This campaign has been created successfully. You will be able to edit this campaign and republish changes."
          primaryButton={{
            label: "Share on your Socials",
            onClick: () => shareCampaign(response.data),
          }}
          secondaryButton={{ label: "Cancel", onClick: modal.hide }}
          clearModal={modal.hide}
        />
      )
    }
  }

  const handleMutationError = (error: any) => {
    console.error('Mutation error details:', error) // Enhanced debug log
    Mixpanel.track("Campaign creation error")
    const message = extractErrorMessage(error)

    if (Array.isArray(message)) {
      for (let msg of message) {
        toast({ title: "Oops!", body: msg, type: "error" })
      }
    } else {
      toast({ title: "Oops!", body: message || 'An unexpected error occurred', type: "error" })
    }
  }

  // Fix 3: Simplified submit function
  const submit = async (formFields: FormFields) => {
    Mixpanel.track("Create campaign clicked")
    
    const {
      category,
      campaignImages,
      title,
      story,
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

    const isFundraiseRelated = campaignType?.toLowerCase()?.includes("fundraise")
    const isVolunteerRelated = campaignType?.toLowerCase()?.includes("volunteer")
    const isIndividual = user?.userType == "individual"

    const payload: any = {
      title,
      category,
      story,
      campaignType: isIndividual ? CampaignType.Fundraise : campaignType,
      campaignStartDate: campaignDuration[0].toISOString(),
      campaignEndDate: campaignDuration[1].toISOString(),
    }

    if (campaignImages) {
      payload.campaignCoverImage = campaignImages[0]

      if (campaignImages.length > 1) {
        payload.campaignAdditionalImages = campaignImages.slice(1)
      }
    }

    if (isFundraiseRelated || isIndividual) {
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

    const body = objectToFormData(payload)

    // Fix 4: Use proper mutation calls with validation
    try {
      if (isEdit && campaignId?.[0]) {
       
        updateMutation.mutate({ campaignId: campaignId?.[0], data: body })
      } else {
        createMutation.mutate(body)
      }
    } catch (error) {
      // Error handling is now in the mutation onError callbacks
      handleMutationError(error)
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

  // Show loading state during mutations or while fetching campaign data
  if (createMutation.isLoading || updateMutation.isLoading || (isEdit && campaignQuery.isLoading)) {
    return <FormSkeleton />
  }

  // Show loading state if editing but no campaign data yet
  if (isEdit && campaignId && !campaign && !campaignQuery.error) {
    return <FormSkeleton />
  }

  // If we're editing but don't have a campaign ID, show error
  if (isEdit && !campaignId) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error: No campaign ID provided for editing</p>
      </div>
    )
  }

  if (campaignId && !form.getValues().title && !campaignQuery.isLoading) {
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
  campaignId?: string // Optional for create, required for edit
  children: React.ReactNode
}

// Add a type guard to help with debugging
const isValidCampaignId = (id: string | undefined): id is string => {
  return typeof id === 'string' && id.trim().length > 0
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