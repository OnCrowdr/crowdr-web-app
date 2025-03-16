import InputTitle from "@/app/common/components/InputTitle"
import TextInput from "@/app/common/components/TextInput"
import Link from "next/link"
import { useFormContext } from "react-hook-form"
import { CampaignFormContext } from "../useCampaignForm"
import SelectInput from "@/app/common/components/SelectInput"
import { Option } from "@/app/(protected)/(dashboard)/common/utils/form"
import { campaignCategories } from "@/utils/campaignCategory"
import DateInput from "@/app/common/components/DateInput"
import TextAreaInput from "@/app/common/components/TextAreaInput"
import { WhiteButton, Button } from "@/app/common/components/Button"
import { RFC } from "@/app/common/types"

const Step2: RFC<Props> = ({ index, onStep }) => {
  const { ...form } = useFormContext() as CampaignFormContext
  const errors = form.formState.errors

  const nextStep = () => {
    const title = form.getValues("title")
    const category = form.getValues("category")
    const campaignDuration = form.getValues("campaignDuration")
    const story = form.getValues("story")
    const isInvalid =
      !title ||
      !category ||
      !campaignDuration ||
      !story ||
      story.length < 60 ||
      story.length > 5000

    if (!isInvalid) {
      onStep(index + 1)
    } else {
      form.trigger("title")
      form.trigger("category")
      form.trigger("campaignDuration")
      form.trigger("story")
    }
  }

  return (
    <div className="pt-10 pb-6">
      <div className="text-sm text-center rounded-lg bg-[#E6F8F0] max-w-[483px] py-[15px] px-4 mx-auto mb-[45px]">
        We've provided{" "}
        {/* <Link href={"#"} className="underline text-[#019350]"> */}
        writing prompts{" "}
        {/* </Link>{" "} */}
        and guides to help you along the way.
      </div>

      <div className="max-w-[883px]">
        {/* title */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
          <InputTitle
            title="Title"
            detail="Make sure it's brief and eye-catching!"
          />
          <div className="max-w-lg">
            <TextInput
              name="title"
              rules={{
                required: "Title is required",
              }}
              error={errors.title}
              ariaLabel="Title"
            />
          </div>
        </div>

        {/* category */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
          <InputTitle
            title="Category"
            detail="Choose a category that best represents your campaign."
          />
          <div className="max-w-lg">
            <SelectInput
              name="category"
              options={categories}
              rules={{
                required: "Category is required",
              }}
              error={errors.category}
              ariaLabel="Category"
            />
          </div>
        </div>

        {/* choose a campaign duration */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
          <InputTitle
            title="Choose a Campaign Duration"
            detail="This is how long you want the campaign to run. You can edit this later."
          />

          <div className="max-w-lg">
            <DateInput
              config={form.register("campaignDuration", {
                required: "Campaign duration is required",
              })}
              error={errors.campaignDuration as any}
              mode="range"
              minDate={new Date()}
              // enableTime
            />
          </div>
        </div>

        {/* tell your story */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-14 lg:mb-[25px]">
          <InputTitle
            title="Tell Your Story"
            detail="Three words: Details, details, details!"
          >
            <div className="hidden md:block lg:max-w-[262px]">
              <WritingTips />
            </div>
          </InputTitle>

          <div className="grid gap-5 max-w-lg">
            <TextAreaInput
              name="story"
              rules={{
                required: "Story is required",
              }}
              characterLimit={5000}
              additionalCharacterInfo="(must be between 60 - 5000 characters)"
              error={errors.story}
              ariaLabel="Tell Your Story"
            />

            <div className="block md:hidden lg:max-w-[262px]">
              <WritingTips />
            </div>
          </div>
        </div>

        {/* prev x next */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-end gap-4">
          <WhiteButton
            text="Back"
            shadow
            onClick={() => onStep(index - 1)}
            className="!bg-[#C2C3C6] !text-white justify-center grow lg:max-w-[220px]"
          />

          <Button
            text={"Continue"}
            onClick={nextStep}
            className=" justify-center grow lg:max-w-[220px]"
          />
        </div>
      </div>
    </div>
  )
}

export default Step2

interface Props {
  index: number
  onStep: (step: number) => void
}

const WritingTips = () => {
  return (
    <div className="bg-[#66708519] text-xs text-[#101828] rounded-lg px-4 py-[21px] mt-[17px]">
      <p className="text-xs text-[#079455] font-bold mb-2.5">💡 TIPS:</p>

      <p className="mb-3">Some ideas to help you start writing:</p>

      <ul className="list-disc pl-4">
        {tips.map((tip, index) => (
          <li key={index} className="leading-[20px]">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
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
