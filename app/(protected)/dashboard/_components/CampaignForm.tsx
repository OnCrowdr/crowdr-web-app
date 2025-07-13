import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useFormContext, useWatch } from "react-hook-form"
import CampaignFormContext, {
  FormFields,
} from "../campaigns/_create-or-edit-campaign/utils/useCreateCampaign"
import { Button, WhiteButton } from "../../../../components/Button"
import TextInput from "../../../../components/TextInput"
import SelectInput from "../../../../components/SelectInput"
import InputTitle from "../../../../components/InputTitle"
import TextAreaInput from "../../../../components/TextAreaInput"
import NumberInput from "../../../../components/NumberInput"
import DateInput from "../../../../components/DateInput"
import OptionInput from "../../../../components/OptionInput"
import FileInput from "../../../../components/FileInput"
import FormSkeleton from "./skeletons/FormSkeleton"
import { useUser } from "../../../../contexts/UserProvider"
import { useToast } from "../../../../hooks/useToast"
import { Option } from "../_common/utils/form"
import makeRequest from "../../../../utils/makeRequest"
import { extractErrorMessage } from "../../../../utils/extractErrorMessage"
import { isFundraise, isVolunteer } from "../_common/utils/campaign"

import { campaignCategories } from "../../../../utils/campaignCategory"
import { RFC } from "@/types"
import { ICampaign } from "@/types/Campaign"
import CaretIcon from "@/public/svg/caret.svg"
import { regex } from "regex"
import { Campaign } from "@/api/_campaigns/models/GetCampaigns"
import { useAuth } from "@/contexts/AppProvider"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import query from "@/api/query"
import _my_campaigns from "@/api/_my_campaigns"

const CampaignForm: RFC<CampaignFormProps> = ({ submit, campaignId }) => {
  const {
    register,
    control,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormContext() as CampaignFormContext
  const { user } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const [skillsNeeded, campaignType, currency] = useWatch({
    control,
    name: ["skillsNeeded", "campaignType", "currency"],
  })
  const [formFetched, setFormFetched] = useState(false)
  const isIndividual = user?.userType == "individual"
  const showFundraiseSection =
    Boolean(campaignType?.match(/fundraise/i)) || isIndividual
  const showVolunteerSection = Boolean(campaignType?.match(/volunteer/i))
  const otherSkillsRef = useRef<HTMLInputElement>(null)
  const isEdit = Boolean(campaignId)
  const saveButtonText = isEdit ? "Save" : "Launch Campaign"
  const pageTitle = isEdit ? "Edit Campaign" : "Create Campaign"
  const pageSubtext = isEdit
    ? "Enter correct details to update campaign"
    : "Now’s your chance to tell your story!"

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

  const currencySymbol = useMemo(() => {
    const currencyLabel = currencies.find((c) => c.value === currency)!
    // return (currencyLabel?.label?.match(/\((.)\)/) || [])[1]
    return currencyLabel?.label?.slice(-3)?.at(1)
  }, [currency])

  const campaignQuery = useAuthQuery({
    queryKey: [query.keys.MY_CAMPAIGN, campaignId],
    queryFn: () => _my_campaigns.getCampaign({ campaignId: campaignId! }),
    select: (data) => mapResponseToForm(data),
    enabled: !!campaignId,
  })
  const campaign = campaignQuery.data

  useEffect(() => {
    if (campaign) {
      reset(campaign)
      setFormFetched(true)

      // const fetchCampaignData = async () => {
      //   try {
      //     // const endpoint = `/my-campaigns/${campaignId}`
      //     // const headers = {
      //     //   "Content-Type": "multipart/form-data",
      //     //   "x-auth-token": user.token,
      //     // }
      //     // const { data } = await makeRequest<ICampaign>(endpoint, {
      //     //   headers,
      //     //   method: "GET",
      //     // })
      //     // const formData = mapResponseToForm(campaign)
      //   } catch (error) {}
      // }

      // fetchCampaignData()
    } else if (campaignQuery.error) {
      const message = extractErrorMessage(campaignQuery.error)
      toast({ title: "Oops!", body: message, type: "error" })
      router.back()
    }
  }, [campaign])

  return (
    <form>
      {/* create campaign */}
      <div className="flex justify-between mb-7 md:mb-5">
        <hgroup>
          <h1 className="text-lg mb-1">{pageTitle}</h1>
          <p className="text-sm text-[#667085]">{pageSubtext}</p>
        </hgroup>

        <div className="hidden md:block">
          <WhiteButton
            text="Cancel"
            shadow
            onClick={() => router.back()}
            className="mr-3"
          />
          <Button
            text={saveButtonText}
            loading={isSubmitting}
            disabled={isSubmitting || (isEdit && !formFetched)}
            onClick={handleSubmit(submit)}
          />
        </div>
      </div>
      <hr className="mb-[26px]" />

      {!isEdit || (isEdit && formFetched) ? (
        <div>
          {/* title */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Title"
              detail="This will be displayed on your campaign."
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

          {/* campaign type */}
          {!isIndividual && !isEdit && (
            <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
              <InputTitle
                title="Campaign Type"
                detail="Choose the type that fits the needs of your campaign."
              />
              <div className="max-w-lg">
                <SelectInput
                  name="campaignType"
                  options={campaignTypes}
                  rules={{
                    required: "Campaign type is required",
                  }}
                  error={errors.campaignType}
                  ariaLabel="Campaign Type"
                />
              </div>
            </div>
          )}

          {/* category */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Category"
              detail="Choose the most relevant category that best represents your campaign."
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
              detail="Determine the timeframe for your campaign."
            />

            <div className="max-w-lg">
              <DateInput
                config={register("campaignDuration", {
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
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Tell Your Story"
              detail="The more details, the better."
            />
            <div className="max-w-lg">
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
            </div>
          </div>

          {/* upload engaging media */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Upload Engaging Media"
              detail="Visuals can make a significant impact on your campaign's success."
            />

            <div className="max-w-lg">
              <FileInput
                name="campaignImages"
                rules={{
                  required: {
                    value: isEdit ? false : true,
                    message: "Campaign image is required",
                  },
                }}
                error={errors.campaignImages}
                maxFileSizeInMb={2}
                multiple
                showFileList
              />
            </div>
          </div>
          <hr className="mb-5" />

          {/* FUNDRAISE */}
          {showFundraiseSection && (
            <details
              open
              style={{ paddingTop: isIndividual ? 8 : 0 }}
              className="group open:mb-10 md:open:mb-14"
            >
              <summary
                hidden={isIndividual}
                className={
                  (isIndividual ? "hidden" : "flex") +
                  " gap-[10px] text-primary cursor-pointer mb-2"
                }
              >
                Fundraise
                <Image
                  src={CaretIcon}
                  alt=""
                  className="group-open:-scale-y-[1]"
                />
              </summary>

              {/* currency */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle
                  title="Currency"
                  detail="Select the currency type for the fundraiser."
                />
                <div className="max-w-lg">
                  <SelectInput
                    name="currency"
                    options={currencies}
                    rules={{
                      required: "Currency is required",
                    }}
                    error={errors.currency}
                    ariaLabel="Currency"
                  />
                </div>
              </div>

              {/* set your funding goal */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle
                  title="Set Your Funding Goal"
                  detail="You can always adjust your goal as your campaign progresses."
                />
                <div className="max-w-lg">
                  <NumberInput
                    name="fundingGoal"
                    rules={{
                      required: "Funding goal is required",
                    }}
                    error={errors.fundingGoal}
                    prefix={currencySymbol}
                  />
                </div>
              </div>
            </details>
          )}

          {/* CALL FOR VOLUNTEERS */}
          {showVolunteerSection && (
            <details open className="group mb-[34px] md:mb-10">
              <summary className="flex gap-[10px] text-primary cursor-pointer mb-2">
                Call for Volunteers
                <Image
                  src={CaretIcon}
                  alt=""
                  className="group-open:-scale-y-[1]"
                />
              </summary>

              {/* skills needed */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle
                  title="Skills Needed"
                  detail="Select all that apply"
                />

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
                      {...register("otherSkillsNeeded", {
                        required:
                          otherSkillsEnabled && "Other skills is required",
                      })}
                      id="otherSkillsNeeded"
                      onChange={(e) => {
                        setValue("otherSkillsNeeded", e.target.value)
                        trigger("otherSkillsNeeded")
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

              {/* age needed */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Age Range" />

                <div className="max-w-lg">
                  {ageRanges.map((ageRange) => (
                    <OptionInput
                      type="radio"
                      key={ageRange.value}
                      value={ageRange.value}
                      label={ageRange.label}
                      name="ageRange"
                      rules={{
                        required: "Age needed is required",
                      }}
                    />
                  ))}
                  {errors.ageRange && (
                    <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                      {errors.ageRange?.message}
                    </span>
                  )}
                </div>
              </div>

              {/* gender preference */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Gender Preference" />

                <div className="max-w-lg">
                  {genderPreferences.map((genderPreference) => (
                    <OptionInput
                      type="radio"
                      key={genderPreference.value}
                      value={genderPreference.value}
                      label={genderPreference.label}
                      name="genderPreference"
                      rules={{
                        required: "Gender preference is required",
                      }}
                    />
                  ))}
                  {errors.genderPreference && (
                    <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                      {errors.genderPreference?.message}
                    </span>
                  )}
                </div>
              </div>

              {/* date and time needed */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Date and Time Needed" />

                <div className="max-w-lg">
                  <DateInput
                    name="timeCommitment"
                    rules={{
                      required: "Time commitment is required",
                    }}
                    error={errors.timeCommitment as any}
                    mode="range"
                    minDate={new Date()}
                    // enableTime
                  />
                </div>
              </div>

              {/* volunteer commitment */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Volunteer Commitment" />

                <div className="max-w-lg">
                  {volunteerCommitment.map((commitment) => (
                    <OptionInput
                      type="radio"
                      key={commitment.value}
                      value={commitment.value}
                      label={commitment.label}
                      name="volunteerCommitment"
                      rules={{
                        required: "Volunteer commitment is required",
                      }}
                    />
                  ))}
                  {errors.volunteerCommitment && (
                    <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                      {errors.volunteerCommitment?.message}
                    </span>
                  )}
                </div>
              </div>

              {/* additional requirements or notes */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle
                  title="Additional Requirements or Notes"
                  id="notes"
                />

                <div className="max-w-lg">
                  <TextAreaInput
                    name="additionalNotes"
                    characterLimit={300}
                    error={errors.additionalNotes}
                    ariaLabelledBy="notes"
                  />
                </div>
              </div>
            </details>
          )}
        </div>
      ) : (
        <div>
          <FormSkeleton />
          <hr className="my-5" />
          <FormSkeleton />
        </div>
      )}
      <div className="flex md:justify-end mb-5">
        <div>
          <WhiteButton
            text="Cancel"
            shadow
            onClick={() => router.back()}
            className="mr-3"
          />
          <Button
            text={saveButtonText}
            loading={isSubmitting}
            disabled={isSubmitting || (isEdit && !formFetched)}
            onClick={handleSubmit(submit)}
          />
        </div>
      </div>
    </form>
  )
}

export default CampaignForm

type CampaignFormProps = {
  submit: (formFields: FormFields) => void
  campaignId?: string
}

const categories = [
  Option("", "Select a category...", true),
  ...campaignCategories,
]

const campaignTypes = [
  Option("", "Select a campaign type...", true),
  Option("fundraise", "Fundraise"),
  Option("volunteer", "Volunteer"),
  Option("fundraiseAndVolunteer", "Fundraise and volunteer"),
]

const currencies = [
  Option("", "Select a currency...", true),
  Option("naira", "Naira (₦)"),
  // Option("dollar", "Dollar ($)"),
]

const skillsList = [
  Option("event planning", "Event Planning"),
  Option("marketing & social media", "Marketing & Social Media"),
  Option("photography & videography", "Photography & Videography"),
  Option("teaching & training", "Teaching & Training"),
]

const ageRanges = [
  Option("18 - 25", "18 - 25"),
  Option("26 - 35", "26 - 35"),
  Option("36 - 45", "36 - 45"),
  Option("46 - 55", "46 - 55"),
  Option("56 and above", "56 and above"),
  Option("no preference", "No preference"),
]

const genderPreferences = [
  Option("female", "Female"),
  Option("male", "Male"),
  Option("no preference", "No preference"),
]

const volunteerCommitment = [
  Option("one-time event", "One-time event"),
  Option("weekly commitment", "Weekly commitment"),
  Option("monthly commitment", "Monthly commitment"),
  Option("flexible schedule", "Flexible schedule"),
]

export function mapResponseToForm(campaign: Campaign): Partial<FormFields> {
  const {
    title,
    category,
    campaignType,
    story,
    campaignStartDate,
    campaignEndDate,
  } = campaign

  let currency,
    fundingGoal,
    skillsNeeded,
    otherSkillsNeeded,
    ageRange,
    genderPreference,
    timeCommitment: [string, string] | undefined,
    volunteerCommitment,
    additionalNotes,
    volunteerCount,
    campaignAddress,
    phoneNumber,
    contactEmail
  const campaignDuration: [Date, Date] = [
    new Date(campaignStartDate),
    new Date(campaignEndDate),
  ]

  if (isFundraise(campaign)) {
    const { fundraise } = campaign
    const [fundingGoalDetail] = fundraise.fundingGoalDetails
    fundingGoal = fundingGoalDetail.amount
    currency = fundingGoalDetail.currency
  }

  if (isVolunteer(campaign)) {
    const { volunteer } = campaign
    skillsNeeded = volunteer.skillsNeeded
    ageRange = volunteer.ageRange
    genderPreference = volunteer.genderPreference
    timeCommitment = [
      volunteer.commitementStartDate,
      volunteer.commitementEndDate,
    ]
    volunteerCommitment = volunteer.requiredCommitment
    additionalNotes = volunteer.additonalNotes
    // otherSkillsNeeded = volunteer.otherSkillsNeeded
    volunteerCount = volunteer.volunteersNeeded
    campaignAddress = volunteer.address
    phoneNumber = volunteer.phoneNumber
    contactEmail = volunteer.email
  }

  return {
    title,
    category,
    campaignType,
    story,
    currency,
    fundingGoal,
    campaignDuration,
    skillsNeeded,
    // otherSkillsNeeded,
    ageRange,
    genderPreference,
    timeCommitment,
    volunteerCommitment,
    additionalNotes,
    volunteerCount,
    campaignAddress,
    phoneNumber,
    contactEmail,
  }
}
