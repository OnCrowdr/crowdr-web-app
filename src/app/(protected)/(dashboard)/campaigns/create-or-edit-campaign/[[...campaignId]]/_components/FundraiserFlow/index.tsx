import { use, useState } from "react"
import { CampaignFormContext } from "../useCampaignForm"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import Stepper from "../Stepper"
import { BiWallet } from "react-icons/bi"
import { BsMegaphone } from "react-icons/bs"
import { LuImageUp } from "react-icons/lu"
import { useFormContext } from "react-hook-form"

const FundraiserFlow = () => {
  const { isEdit, campaignType, setCampaignForm, submitForm, ...form } =
    useFormContext() as CampaignFormContext
  const [currentStep, setStep] = useState(0)
  const pageTitle = isEdit ? "Edit Campaign" : "Create a campaign"
  const pageSubtext = isEdit ? form.getValues().title : "Start a campaign now"

  const handleDone = () => {
    if (campaignType === "fundraise") {
      submitForm()
    } else {
      setCampaignForm("volunteer")
    }
  }

  return (
    <div>
      <hgroup className="border-b border-b-[#E3E3E3] pb-4 mb-10">
        <h1 className="text-2xl mb-0.5">{pageTitle}</h1>
        <p className="text-sm text-[#61656B]">{pageSubtext}</p>
      </hgroup>

      <Stepper value={currentStep} steps={steps} />

      {currentStep === 0 && <Step1 index={0} onStep={setStep} />}
      {currentStep === 1 && <Step2 index={1} onStep={setStep} />}
      {currentStep === 2 && (
        <Step3 index={2} onStep={setStep} onDone={handleDone} />
      )}
    </div>
  )
}

export default FundraiserFlow

const steps = [
  {
    label: "Funding goal",
    icon: BiWallet,
  },
  {
    label: "Campaign details",
    icon: BsMegaphone,
  },
  {
    label: "Campaign Images",
    icon: LuImageUp,
  },
]
