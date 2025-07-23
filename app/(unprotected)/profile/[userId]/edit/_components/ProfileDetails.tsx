"use client"
import { useState } from "react"
import IndividualForm from "./IndividualForm"
import { UserType } from "@/types"
import OrganizationForm from "./OrganizationForm"
import { ProfileFormContext } from "./Provider"
import { useFormContext } from "react-hook-form"

const ProfileDetails = () => {
  const { formType } = useFormContext() as ProfileFormContext
  const Form =
    formType === UserType.Individual ? IndividualForm : OrganizationForm

  return (
    <div className="p-4 md:p-8">
      <Form />
    </div>
  )
}

export default ProfileDetails
