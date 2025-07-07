"use client"
import { Option } from "../../../../../(protected)/dashboard/_common/utils/form"
import { Button, WhiteButton } from "@/components/shared/Button"
import DateInput from "@/components/shared/DateInput"
import FileInput from "@/components/shared/FileInput"
import InputTitle from "@/components/shared/InputTitle"
import SelectInput from "@/components/shared/SelectInput"
import TextAreaInput from "@/components/shared/TextAreaInput"
import TextInput from "@/components/shared/TextInput"
import { UserType } from "@/types"
import { campaignCategories } from "@/utils/campaignCategory"
import { useFormContext } from "react-hook-form"
import { ProfileFormContext } from "./Provider"
import { profile } from "console"
import { useRouter } from "next/navigation"

const IndividualForm = () => {
  const router = useRouter()
  const { submitForm, ...form } = useFormContext() as ProfileFormContext
  const errors = form.formState.errors

  return (
    <div>
      <hgroup className="border-b border-b-[#E3E3E3] pb-4 mb-10">
        <h1 className="text-2xl mb-0.5">Edit Profile</h1>
        <p className="text-sm text-[#61656B]">Be sure to save your changes.</p>
      </hgroup>

      <div className="pt-10 pb-6">
        <div className="max-w-[883px]">
          {/* full name / organization name */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title={
                form.getValues("accountType") === UserType.Individual
                  ? "Full Name"
                  : "Organization Name"
              }
              detail="This field can not be edited."
            />
            <div className="max-w-lg">
              <TextInput
                name="fullName"
                disabled
                // rules={{
                //   required: "Full name is required",
                //   minLength: {
                //     value: 15,
                //     message: "Full name must be at least 15 characters",
                //   },
                // }}
                // error={errors.fullName}
                ariaLabel="Full name"
              />
            </div>
          </div>

          {/* account type */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Account Type"
              detail="This field can not be edited."
            />
            <div className="max-w-lg">
              <SelectInput
                name="accountType"
                disabled
                options={accountTypes}
                // rules={{
                //   required: "Account type is required",
                // }}
                // error={errors.accountType}
                ariaLabel="Account type"
              />
            </div>
          </div>

          {/* location */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle title="Location" detail="Tell us where you're from!" />
            <div className="max-w-lg">
              <TextInput
                name="location"
                placeholder="Magodo Phase II, Lagos"
                // rules={{
                //   required: "Location is required",
                //   minLength: {
                //     value: 15,
                //     message: "Location must be at least 15 characters",
                //   },
                // }}
                // error={errors.location}
                ariaLabel="Location"
              />
            </div>
          </div>

          {/* bio */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Bio"
              detail="Who are you? What do you love to do? We want to know...everything!"
            />

            <div className="grid gap-5 max-w-lg">
              <TextAreaInput
                name="bio"
                // rules={{
                //   required: "Bio is required",
                //   minLength: {
                //     value: 60,
                //     message: "Bio must be at least 60 characters",
                //   },
                // }}
                // error={errors.bio}
                characterLimit={5000}
                additionalCharacterInfo="(must be between 60 - 5000 characters)"
                ariaLabel="Bio"
              />
            </div>
          </div>

          {/* instagram */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Social Media - Instagram"
              detail="Please link your Instagram. This is optional!"
            />
            <div className="max-w-lg">
              <TextInput
                name="instagram"
                // error={errors.instagram}
                ariaLabel="Instagram"
              />
            </div>
          </div>

          {/* twitter */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle
              title="Social Media - Twitter"
              detail="Please link your Twitter. This is optional!"
            />
            <div className="max-w-lg">
              <TextInput
                name="twitter"
                // error={errors.twitter}
                ariaLabel="Twitter"
              />
            </div>
          </div>

          {/* contact email */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
            <InputTitle title="Contact - Email" detail="" />
            <div className="max-w-lg">
              <TextInput
                name="contactEmail"
                // rules={{
                //   required: "Contact email is required",
                // }}
                // error={errors.contactEmail}
                ariaLabel="Contact email"
              />
            </div>
          </div>

          {/* upload engaging media */}
          <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-14 lg:mb-[25px]">
            <InputTitle
              title="Upload Engaging Media"
              detail="Now is your chance to show off! Upload high-quality visuals of all the good work you've done!"
            />

            <div className="max-w-lg">
              <FileInput
                name="engagingMedia"
                // rules={{
                //   required: {
                //     value: true,
                //     message: "Engaging media is required",
                //   },
                // }}
                // error={errors.engagingMedia}
                maxFileSizeInMb={3}
                multiple
                showFileList
              />
            </div>
          </div>

          {/* prev x next */}
          <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-end gap-4">
            <WhiteButton
              text="Back"
              buttonType="button"
              shadow
              onClick={() => router.back()}
              className="!bg-[#C2C3C6] !text-white justify-center grow lg:max-w-[220px]"
            />

            <Button
              buttonType="button"
              loading={form.formState.isSubmitting}
              text={"Save Changes"}
              onClick={() => submitForm()}
              className=" justify-center grow lg:max-w-[220px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndividualForm

const categories = [
  Option("", "Select a category...", true),
  ...campaignCategories,
]

const accountTypes = [
  Option(UserType.Individual, "Individual"),
  Option(UserType.NonProfit, "Organization"),
]
