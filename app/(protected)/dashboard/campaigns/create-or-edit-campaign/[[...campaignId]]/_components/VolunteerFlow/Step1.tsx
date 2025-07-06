import { useUser } from "../../../../../../../../contexts/UserProvider"
import CaretIcon from "@/public/svg/caret.svg"
import Image from "next/image"
import InputTitle from "../../../../../../../../components/shared/InputTitle"
import SelectInput from "../../../../../../../../components/shared/SelectInput"
import NumberInput from "../../../../../../../../components/shared/NumberInput"
import { Option } from "../../../../../_common/utils/form"
import { use, useMemo, useRef } from "react"
import { CampaignFormContext } from "../useCampaignForm"
import { useFormContext } from "react-hook-form"
import { Button, WhiteButton } from "../../../../../../../../components/shared/Button"
import { RFC } from "@/types"
import OptionInput from "../../../../../../../../components/shared/OptionInput"
import TextInput from "../../../../../../../../components/shared/TextInput"
import { CampaignType } from "../../../../../../admin/common/services/campaign/models/GetCampaigns"

const Step1: RFC<Props> = ({ index, onStep }) => {
  const user = useUser()
  const { campaignType, setCampaignForm, ...form } =
    useFormContext() as CampaignFormContext
  const errors = form.formState.errors
  const skillsNeeded = form.watch("skillsNeeded")
  const volunteerCount = form.watch("volunteerCount")
  const isIndividual = user?.userType == "individual"
  const otherSkillsRef = useRef<HTMLInputElement>(null)
  const isFundraiserVolunteer = campaignType === CampaignType.FundraiseVolunteer

  const otherSkillsEnabled = useMemo(() => {
    if ((skillsNeeded || [])?.includes("others")) {
      if (otherSkillsRef.current) {
        setTimeout(() => otherSkillsRef.current?.focus(), 0)
      }
      return true
    } else {
      return false
    }
  }, [skillsNeeded])

  const nextStep = () => {
    const skillsNeeded = form.getValues("skillsNeeded")
    const otherSkillsNeeded = form.getValues("otherSkillsNeeded")
    const isInvalid =
      !skillsNeeded.length ||
      (skillsNeeded.includes("others") && !otherSkillsNeeded) ||
      !volunteerCount ||
      Number(volunteerCount) <= 0 ||
      Number(volunteerCount) >= 1000

    if (!isInvalid) {
      onStep(index + 1)
    } else {
      form.trigger("skillsNeeded")
      skillsNeeded.includes("others") && form.trigger("otherSkillsNeeded")
    }
  }

  return (
    <div className="pt-10 pb-6">
      <div className="max-w-[888px]">
        {/* CALL FOR VOLUNTEERS */}
        <details open className="group mb-[34px] md:mb-10">
          <summary className="flex gap-[10px] text-primary cursor-pointer mb-2">
            Call for Volunteers
            <Image src={CaretIcon} alt="" className="group-open:-scale-y-[1]" />
          </summary>

          {/* skills needed */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle title="Skills Needed" detail="Select all that apply" />

            <div className="max-w-lg">
              {skillsList.map((skill) => (
                <OptionInput
                  type="checkbox"
                  key={skill.value}
                  value={skill.value}
                  label={skill.label}
                  name="skillsNeeded"
                  rules={{
                    required: "Skills needed is required",
                  }}
                />
              ))}
              <div className="flex">
                <OptionInput
                  type="checkbox"
                  value="others"
                  label="Other (please specify):"
                  name="skillsNeeded"
                />
                <input
                  {...form.register("otherSkillsNeeded", {
                    required: otherSkillsEnabled && "Other skills is required",
                  })}
                  id="otherSkillsNeeded"
                  onChange={(e) => {
                    form.setValue("otherSkillsNeeded", e.target.value)
                    form.trigger("otherSkillsNeeded")
                  }}
                  ref={otherSkillsRef}
                  disabled={!otherSkillsEnabled}
                  className="-translate-y-1 border-t-0 border-b border-[#4c4c4c] border-dashed outline-none w-28 h-6 ml-2"
                />
              </div>
              {(errors.skillsNeeded || errors.otherSkillsNeeded) && (
                <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                  {errors.skillsNeeded?.message ||
                    errors.otherSkillsNeeded?.message}
                </span>
              )}
            </div>
          </div>

          {/* Volunteer Count */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Volunteer Count"
              detail="Specify the number of volunteers needed!"
            />
            <div className="max-w-lg">
              <TextInput
                name="volunteerCount"
                placeholder="Enter the number of volunteers"
                rules={{
                  required: "Volunteer count is required",
                  validate: (value) => {
                    const number = Number(value)
                    return !isNaN(number) && number > 0 && number < 1000
                  },
                }}
                type="number"
                error={errors.volunteerCount}
                ariaLabel="Volunteer Count"
              />
            </div>
          </div>
        </details>
      </div>

      <hr className="border-t border-t-[#E4E7EC]" />

      <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-end gap-4 max-w-[888px] pt-[52px]">
        {isFundraiserVolunteer && (
          <WhiteButton
            text="Back to Fundraiser campaign"
            shadow
            onClick={() => setCampaignForm("fundraise")}
            className="!bg-[#C2C3C6] !text-white justify-center grow lg:max-w-[240px]"
          />
        )}

        <Button
          text={"Continue"}
          onClick={nextStep}
          className={"justify-center grow lg:max-w-[220px]"}
        />
      </div>
    </div>
  )
}

export default Step1

interface Props {
  index: number
  onStep: (step: number) => void
}

const skillsList = [
  Option("event planning", "Event Planning"),
  Option("marketing & social media", "Marketing & Social Media"),
  Option("photography & videography", "Photography & Videography"),
  Option("teaching & training", "Teaching & Training"),
]
