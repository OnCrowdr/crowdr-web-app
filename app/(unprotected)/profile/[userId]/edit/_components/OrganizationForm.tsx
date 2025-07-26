"use client"

import { Button, WhiteButton } from "@/components/Button"
import FileInput, { FileInputContent } from "@/components/FileInput"
import InputTitle from "@/components/InputTitle"
import TextInput from "@/components/TextInput"
import { Fragment, useState } from "react"
import { EMPTY_MEMBER, ProfileFormContext } from "./Provider"
import { useFieldArray, useFormContext } from "react-hook-form"
import { UserType } from "@/types"
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react"
import { time } from "@/lib/time"
import CompletionCard from "@/app/(protected)/dashboard/_components/CompletionCard"
import OldModal from "@/components/OldModal"

const OrganizationForm = () => {
  const [memberToRemoveIndex, setMemberToRemoveIndex] = useState<number>()
  const { setFormType, submitForm, profile, deletedMedia, control, ...form } =
    useFormContext() as ProfileFormContext
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  })
  const members = form.watch("members")
  const hasReachedLimit = members?.length >= MEMBER_LIMIT

  const addMember = () => {
    if (hasReachedLimit) return

    append(EMPTY_MEMBER)
    setTimeout(() => {
      const position = members.length + 1
      const lastMember = document.getElementById(`member-${position}`)
      lastMember?.scrollIntoView({ behavior: "smooth" })
    }, time.secs(0.1))
  }

  const closeModal = () => setMemberToRemoveIndex(undefined)

  return (
    <>
      <div>
        <hgroup className="border-b border-b-[#E3E3E3] pb-4 mb-10">
          <h1 className="text-2xl mb-0.5">Edit Profile - Team</h1>
          <p className="text-sm text-[#61656B]">
            Please only include the first six core members on your team.
          </p>
        </hgroup>

        <div className="pt-10 pb-6">
          <div className="max-w-[883px]">
            {fields.map((field, index) => {
              const position = index + 1

              return (
                <Fragment key={field.id}>
                  {/* full name */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle
                      title={`Team member ${position}`}
                      detail={
                        <p className="text-sm text-[#667085]">
                          Please enter their full name.
                        </p>
                      }
                    />
                    <div className="max-w-lg">
                      <TextInput
                        name={`members.${index}.fullname`}
                        ariaLabel={"Full name"}
                        rules={{
                          required: "Full name is required",
                        }}
                      />
                    </div>
                  </div>

                  {/* position */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
                    <InputTitle
                      title={`Position`}
                      detail={
                        <p className="text-sm text-[#667085]">
                          For example: Founder
                        </p>
                      }
                    />
                    <div className="max-w-lg">
                      <TextInput
                        name={`members.${index}.position`}
                        ariaLabel={"Position"}
                      />
                    </div>
                  </div>

                  {/* photo */}
                  <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-2">
                    <InputTitle
                      title={`Photo`}
                      detail="Please upload a picture of this team member."
                    />

                    <div className="max-w-lg">
                      <FileInput
                        name={`members.${index}.photo`}
                        maxFileSizeInMb={3}
                        showFileList
                        rules={{
                          required: {
                            value: true,
                            message: "Photo is required",
                          },
                        }}
                      >
                        {field.mediaUrl && (
                          <FileInputContent
                            previewImage={field.mediaUrl}
                            subtext="or drag and drop"
                            showPreview
                          />
                        )}
                      </FileInput>
                    </div>
                  </div>

                  {/* remove team member */}
                  <div className="flex justify-end">
                    <button
                      id={`member-${position}`}
                      type="button"
                      onClick={() => setMemberToRemoveIndex(index)}
                      className="inline-flex items-center gap-1.5 text-[#D92D20] hover:bg-[#FEE4E2] transition-colors rounded-md p-1 px-2 mb-10"
                    >
                      <CircleMinus color="#D92D20" size={20} />
                      Remove team member
                    </button>
                  </div>
                </Fragment>
              )
            })}

            {/* add team member */}
            {!hasReachedLimit && (
              <div className="flex justify-end mb-14 lg:mb-[60px]">
                <button
                  type="button"
                  onClick={addMember}
                  className="inline-flex items-center gap-1.5 text-primary hover:bg-[#DCFAE6] transition-colors rounded-md p-1 px-2 -mt-6"
                >
                  <CirclePlus color="#00b964" size={20} />
                  Add team member
                </button>
              </div>
            )}

            {/* prev x submit */}
            <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-end gap-4">
              <WhiteButton
                text="Back"
                buttonType="button"
                shadow
                onClick={() => {
                  setFormType(UserType.Individual)
                  document.scrollingElement?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }}
                className="!bg-[#C2C3C6] !text-white justify-center grow lg:max-w-[220px]"
              />

              <Button
                buttonType="button"
                loading={form.formState.isSubmitting}
                text={"Save Changes"}
                onClick={submitForm}
                className=" justify-center grow lg:max-w-[220px]"
              />
            </div>
          </div>
        </div>
      </div>

      <OldModal
        isOpen={typeof memberToRemoveIndex === "number"}
        onClose={closeModal}
      >
        <CompletionCard
          title="Remove Team Member"
          text="Are you sure you want to remove team member?"
          primaryButton={{
            label: "Yes, remove",
            bgColor: "#D92D20",
            onClick: () => {
              remove(memberToRemoveIndex)
              setMemberToRemoveIndex(undefined)
            },
          }}
          secondaryButton={{
            label: "Cancel",
            onClick: closeModal,
          }}
          clearModal={closeModal}
          icon={
            <div className="grid place-items-center rounded-full bg-[#FEE4E2] p-3">
              <Trash2 />
            </div>
          }
        />
      </OldModal>
    </>
  )
}

export default OrganizationForm

const MEMBER_LIMIT = 6
