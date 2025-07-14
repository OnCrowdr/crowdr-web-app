"use client"
import { useState } from "react"
import Image from "next/image"
import InputTitle from "../../../../../components/InputTitle"
import TextInput from "../../../../../components/TextInput"
import TextAreaInput from "../../../../../components/TextAreaInput"
import FormSkeleton from "../../../dashboard/_components/skeletons/FormSkeleton"
// import FileItem from "../../admin-dashboard-components/FileItem"
import { Button, WhiteButton } from "../../../../../components/Button"
import ModalTrigger from "../../../../../components/ModalTrigger"

import CrowdrLogo from "@/public/images/brand/crowdr-logo.svg"
import CaretIcon from "@/public/svg/caret.svg"

const ViewCampaign = () => {
  const [formData, setFormData] = useState("f")
  const showFundraiseSection = true
  const showVolunteerSection = true

  return (
    <div>
      <div className="border-b border-black/10 px-[25px] py-[7px] mb-[76px]">
        <Image src={CrowdrLogo} alt="crowdr logo" />
      </div>

      <div className="px-[59px] pb-[238px]">
        {/* page title x subtitle */}
        <hgroup className="pb-6 mb-3">
          <h1 className="text-2xl font-semibold text-black mb-0.5">
            Crowdr Africa
          </h1>
          <p className=" text-[#667085]">Form Application</p>
        </hgroup>
        <hr className="mb-[34px]" />

        <form>
          {formData ? (
            <div className="mb-[222px]">
              {/* title */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Title" />
                <div className="max-w-lg">
                  <TextInput
                    controlled
                    name="title"
                    ariaLabel="Title"
                    disabled
                  />
                </div>
              </div>

              {/* campaign type */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Campaign Type" />
                <div className="max-w-lg">
                  <TextInput
                    controlled
                    name="campaignType"
                    ariaLabel="Campaign Type"
                    disabled
                  />
                </div>
              </div>

              {/* category */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Category" />
                <div className="max-w-lg">
                  <TextInput
                    controlled
                    name="category"
                    ariaLabel="Category"
                    disabled
                  />
                </div>
              </div>

              {/* campaign duration */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Campaign Duration" />
                <div className="max-w-lg">
                  <TextInput
                    controlled
                    name="campaignDuration"
                    ariaLabel="Campaign Duration"
                    disabled
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
                    controlled
                    name="story"
                    ariaLabel="Tell Your Story"
                    disabled
                  />
                </div>
              </div>

              {/* upload engaging media */}
              <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                <InputTitle title="Upload Engaging Media" />
                <div className="max-w-lg">
                  {/* <FileItem /> */}
                </div>
              </div>
              <hr className="mb-5" />

              {/* FUNDRAISE */}
              {showFundraiseSection && (
                <details open className="group open:mb-14">
                  <summary className="flex gap-[10px] text-primary cursor-pointer mb-2">
                    Fundraise
                    <Image
                      src={CaretIcon}
                      alt=""
                      className="group-open:-scale-y-[1]"
                    />
                  </summary>

                  {/* currency */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle title="Currency" />
                    <div className="max-w-lg">
                      <TextInput
                        controlled
                        name="currency"
                        ariaLabel="Currency"
                        disabled
                      />
                    </div>
                  </div>

                  {/* funding goal */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle title="Funding Goal" />
                    <div className="max-w-lg">
                      <TextInput controlled name="fundingGoal" disabled />
                    </div>
                  </div>
                </details>
              )}

              {/* CALL FOR VOLUNTEERS */}
              {showVolunteerSection && (
                <details open className="group mb-10">
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
                    />
                    <div className="max-w-lg">
                      <div className="flex flex-col gap-1">
                        <p>Event Planning</p>
                        <p>Marketing & Social Media</p>
                      </div>
                    </div>
                  </div>

                  {/* age needed */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle title="Age Range" />
                    <div className="max-w-lg">
                      <p>18 - 36</p>
                    </div>
                  </div>

                  {/* gender preference */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle title="Gender Preference" />
                    <div className="max-w-lg">
                      <p>No preference</p>
                    </div>
                  </div>

                  {/* date and time needed */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle title="Date and Time Needed" />
                    <div className="max-w-lg">
                      <TextInput controlled name="timeCommitment" disabled />
                    </div>
                  </div>

                  {/* volunteer commitment */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle title="Volunteer Commitment" />
                    <div className="max-w-lg">
                      <p>One-time event</p>
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
                        controlled
                        name="additionalNotes"
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

          {/* buttons */}
          <div className="flex md:justify-end mb-5">
            <div>
              <ModalTrigger id="kycPopup">
                <WhiteButton
                  text="View KYC"
                  shadow
                  onClick={() => {}}
                  className="mr-3"
                />
              </ModalTrigger>
              <Button
                text="Approve Campaign"
                loading={false}
                disabled={false}
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ViewCampaign
