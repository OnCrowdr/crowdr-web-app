import InputTitle from "../../../../../../../../components/InputTitle";
import TextInput from "../../../../../../../../components/TextInput";
import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";
import { CampaignFormContext } from "../useCampaignForm";
import SelectInput from "../../../../../../../../components/SelectInput";
import { Option } from "../../../../../_common/utils/form";
import { campaignCategories } from "../../../../../../../../utils/campaignCategory";
import DateInput from "../../../../../../../../components/DateInput";
import TextAreaInput from "../../../../../../../../components/TextAreaInput";
import { WhiteButton, Button } from "../../../../../../../../components/Button";
import { RFC } from "@/types";
import OptionInput from "../../../../../../../../components/OptionInput";
import { IoChevronBack } from "react-icons/io5";
import PhoneNumberInput from "../../../../../../../../components/PhoneNumberInput";
import { useEffect, useState } from "react";
import moment from "moment";

const Step2: RFC<Props> = ({ index, onStep, onDone }) => {
  const { campaignType, setShowPreview, ...form } =
    useFormContext() as CampaignFormContext;
  const errors = form.formState.errors;
  const timeCommitment = form.getValues("timeCommitment");
  const [timeNeeded, setTimeNeeded] = useState(() =>
    // it's an array because the flatpickr takes its values as an array
    timeCommitment ? [moment(timeCommitment[0]).format("hh:mm A")] : undefined
  );

  // once time is changed, updated selected commitment date with time picked
  useEffect(() => {
    if (timeCommitment && timeNeeded) {
      const dateWithTime0 = setDateWithTime(timeCommitment[0], timeNeeded[0]);
      const dateWithTime1 = setDateWithTime(timeCommitment[1], timeNeeded[0]);
      form.setValue("timeCommitment", [dateWithTime0, dateWithTime1] as any);
    }
  }, [timeNeeded]);

  const nextStep = (callback: () => void) => {
    const title = form.getValues("title");
    const story = form.getValues("story");
    const category = form.getValues("category");
    const campaignDuration = form.getValues("campaignDuration");
    const ageRange = form.getValues("ageRange");
    const genderPreference = form.getValues("genderPreference");
    const timeCommitment = form.getValues("timeCommitment");
    const volunteerCommitment = form.getValues("volunteerCommitment");
    const campaignAddress = form.getValues("campaignAddress");
    const phoneNumber = form.getValues("phoneNumber");
    const contactEmail = form.getValues("contactEmail");
    const isInvalid =
      !ageRange ||
      !genderPreference ||
      !timeCommitment ||
      !volunteerCommitment ||
      !campaignAddress ||
      !phoneNumber ||
      !contactEmail ||
      (campaignType !== "fundraiseAndVolunteer" &&
        (!title || !story || !category || !campaignDuration));

    if (!isInvalid) {
      callback();
    } else {
      form.trigger("ageRange");
      form.trigger("genderPreference");
      form.trigger("timeCommitment");
      form.trigger("volunteerCommitment");
      form.trigger("campaignAddress");
      form.trigger("phoneNumber");
      form.trigger("contactEmail");

      if (campaignType !== "fundraiseAndVolunteer") {
        form.trigger("title");
        form.trigger("story");
        form.trigger("category");
        form.trigger("campaignDuration");
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    form.setValue("phoneNumber", value, { shouldValidate: true });
  };

  return (
    <div className="pt-10 pb-6">
      <div className="max-w-[883px]">
        {campaignType !== "fundraiseAndVolunteer" && (
          <>
            {/* title */}
            <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
              <InputTitle
                title="Title"
                detail="Make sure it's brief and eye-catching!"
              />
              <div className="max-w-lg">
                <TextInput
                  name="title"
                  placeholder="Help Nicholas go back to college"
                  rules={{
                    required: "Title is required",
                    minLength: {
                      value: 15,
                      message: "Title must be at least 15 characters"
                    }
                  }}
                  error={errors.title}
                  ariaLabel="Title"
                />
              </div>
            </div>

            {/* campaign description */}
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
                    minLength: {
                      value: 60,
                      message: "Story must be at least 60 characters"
                    }
                  }}
                  characterLimit={5000}
                  additionalCharacterInfo="  (must be between 60 - 5000 characters)"
                  error={errors.story}
                  ariaLabel="Tell Your Story"
                />
              </div>
            </div>

            {/* campaign address */}
            <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
              <InputTitle
                title="Campaign Address"
                detail="Provide the address related to the campaign."
              />
              <div className="max-w-lg">
                <TextAreaInput
                  name="campaignAddress"
                  placeholder="123 Main St, City, State"
                  rules={{
                    required: "Campaign address is required"
                  }}
                  characterLimit={5000}
                  error={errors.campaignAddress}
                  ariaLabel="Campaign Address"
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
                    required: "Category is required"
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
                    required: "Campaign duration is required"
                  })}
                  error={errors.campaignDuration as any}
                  mode="range"
                  // minDate={new Date()}
                  // enableTime
                />
              </div>
            </div>
          </>
        )}

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
                  required: "Age needed is required"
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
                  required: "Gender preference is required"
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
            <div className="flex gap-5">
              <DateInput
                name="timeCommitment"
                rules={{
                  required: "Time commitment is required"
                }}
                error={errors.timeCommitment as any}
                mode="range"
                classNames={{ root: "flex-1" }}
                // minDate={new Date()}
                // enableTime
              />

              <DateInput
                value={timeNeeded}
                onChange={(value) => setTimeNeeded([value.dateString])}
                classNames={{ root: "max-w-[90px]" }}
                datepickerOptions={{
                  enableTime: true,
                  noCalendar: true,
                  disableMobile: true,
                  dateFormat: "h:i K",
                  position: (self, customElement) => {
                    self.calendarContainer.style.right = "0px";
                  }
                }}
              />
            </div>
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
                  required: "Volunteer commitment is required"
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

        {/* phone number */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
          <InputTitle title="Phone Number" />

          <div className="max-w-lg">
            <Controller
              name="phoneNumber"
              control={form.control}
              defaultValue=""
              rules={{
                required: "Phone number is required"
              }}
              render={({ field }) => (
                <PhoneNumberInput
                  label=""
                  name="phoneNumber"
                  id="campaign_phone_number"
                  value={field.value}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  required={true}
                  error={errors.phoneNumber?.message as string}
                />
              )}
            />
          </div>
        </div>


        {/* contact email */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
          <InputTitle title="Contact email address" />

          <div className="max-w-lg">
            <TextInput
              name="contactEmail"
              error={errors.contactEmail}
              ariaLabel="Contact Email Address"
              rules={{
                required: "Contact email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address"
                }
              }}
            />
          </div>
        </div>

        {/* code of conduct */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-14 lg:mb-[25px]">
          <InputTitle
            title="Code of conduct - Volunteer guidelines and Health and Safety Information"
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

        {/* prev x next */}
        {campaignType !== "fundraiseAndVolunteer" ? (
          <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-end gap-4">
            <WhiteButton
              text="Back"
              shadow
              onClick={() => onStep(index - 1)}
              className="!bg-[#C2C3C6] !text-white justify-center grow lg:max-w-[220px]"
            />

            <Button
              text={"Continue"}
              onClick={() => nextStep(() => onStep(index + 1))}
              className=" justify-center grow lg:max-w-[220px]"
            />
          </div>
        ) : (
          <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-end gap-4">
            <button
              onClick={() => onStep(index - 1)}
              className="flex items-center gap-1 text-[#00B964] hover:underline mr-auto">
              <IoChevronBack size={24} stroke="#00B964" /> Back to previous page
            </button>

            <WhiteButton
              text="Preview Campaign"
              shadow
              onClick={() => nextStep(() => setShowPreview(true))}
              className="!text-[#00A85B] !border-[#00A85B] hover:!bg-green-50 justify-center grow lg:max-w-[220px]"
            />

            <Button
              text={"Launch Campaign"}
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
              onClick={onDone}
              className="!justify-center grow lg:max-w-[220px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2;

interface Props {
  index: number;
  onStep: (step: number) => void;
  onDone: () => void;
}

const categories = [
  Option("", "Select a category...", true),
  ...campaignCategories
];

const ageRanges = [
  Option("18 - 25", "18 - 25"),
  Option("26 - 35", "26 - 35"),
  Option("36 - 45", "36 - 45"),
  Option("46 - 55", "46 - 55"),
  Option("56 and above", "56 and above"),
  Option("no preference", "No preference")
];

const genderPreferences = [
  Option("female", "Female"),
  Option("male", "Male"),
  Option("no preference", "No preference")
];

const volunteerCommitment = [
  Option("one-time event", "One-time event"),
  Option("weekly commitment", "Weekly commitment"),
  Option("monthly commitment", "Monthly commitment"),
  Option("flexible schedule", "Flexible schedule")
];

function setDateWithTime(date: string | Date, time: string): Date {
  // Parse the date argument into a moment object
  const dateMoment = moment(date);

  // Parse the time argument into a moment object
  const timeMoment = moment(time, "hh:mm A");

  // Set the time of the dateMoment to match the timeMoment
  dateMoment.set({
    hour: timeMoment.hour(),
    minute: timeMoment.minute(),
    second: 0,
    millisecond: 0
  });

  // Return the updated date as a JavaScript Date object
  return dateMoment.toDate();
}
