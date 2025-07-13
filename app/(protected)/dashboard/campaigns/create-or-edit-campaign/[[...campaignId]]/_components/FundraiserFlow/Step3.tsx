import InputTitle from "../../../../../../../../components/InputTitle"
import { useFormContext } from "react-hook-form"
import { CampaignFormContext } from "../useCampaignForm"
import { Option } from "../../../../../_common/utils/form"
import { campaignCategories } from "../../../../../../../../utils/campaignCategory"
import { WhiteButton, Button } from "../../../../../../../../components/Button"
import { RFC } from "@/types"
import FileInput from "../../../../../../../../components/FileInput"
import { twMerge } from "tailwind-merge"
import { ChevronLeft } from "lucide-react"
import { IoChevronBack } from "react-icons/io5"

const Step3: RFC<Props> = ({ index, onStep, onDone }) => {
  const { isEdit, campaignType, setShowPreview, ...form } =
    useFormContext() as CampaignFormContext
  const isFundraiser = campaignType === "fundraise"
  const backButtonText = isFundraiser ? "Preview Campaign" : "Back"
  const errors = form.formState.errors
  const shouldValidateImage = isEdit ? false : true
  const saveButtonText = isFundraiser
    ? // TODO: the save button is not showing the right label in edit campaign mode
      isEdit
      ? "Save"
      : "Launch campaign"
    : "Continue to Volunteer campaign"

  const nextStep = (callback: () => void) => {
    const campaignImages = form.getValues("campaignImages")
    const isInvalid = !campaignImages

    if (!shouldValidateImage || (shouldValidateImage && !isInvalid)) {
      callback()
    } else {
      form.trigger("campaignImages")
    }
  }

  return (
    <div className="pt-10 pb-6">
      <div className="max-w-[888px]">
        {/* upload engaging media */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-14 lg:mb-[25px]">
          <InputTitle
            title="Upload Engaging Media"
            detail="Did you know that campaigns with high-quality visuals are 2x more likely to receive donations?"
          />

          <div className="max-w-lg">
            <FileInput
              name="campaignImages"
              rules={{
                required: {
                  value: shouldValidateImage,
                  message: "Campaign image is required",
                },
              }}
              error={errors.campaignImages}
              maxFileSizeInMb={3}
              multiple
              showFileList
            />
          </div>
        </div>

        {/* prev x next */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-end gap-4">
          {isFundraiser && (
            <button
              onClick={() => onStep(index - 1)}
              className="flex items-center gap-1 text-[#00B964] hover:underline mr-auto"
            >
              <IoChevronBack size={24} stroke="#00B964" /> Back to previous page
            </button>
          )}

          <WhiteButton
            text={backButtonText}
            shadow
            onClick={() =>
              isFundraiser
                ? nextStep(() => setShowPreview(true))
                : onStep(index - 1)
            }
            className={twMerge(
              "justify-center grow lg:max-w-[220px]",
              isFundraiser
                ? "!text-[#00A85B] !border-[#00A85B] hover:!bg-green-50"
                : "!text-white !bg-[#C2C3C6]"
            )}
          />

          <Button
            text={saveButtonText}
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            onClick={() => nextStep(onDone)}
            className={twMerge(
              "justify-center grow lg:max-w-[220px]",
              campaignType === "fundraiseAndVolunteer" && "lg:max-w-[240px]"
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default Step3

interface Props {
  index: number
  onStep: (step: number) => void
  onDone: () => void
}

const categories = [
  Option("", "Select a category...", true),
  ...campaignCategories,
]

const tips = [
  "Start with a short introduction of yourself",
  "Why this campaign is important to you and",
  "Your plans for the funds.",
]
