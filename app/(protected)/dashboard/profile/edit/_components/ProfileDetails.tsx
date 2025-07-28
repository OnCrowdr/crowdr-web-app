"use client"
import { useState } from "react"
import IndividualForm from "./IndividualForm"
import { UserType } from "@/types"
import OrganizationForm from "./OrganizationForm"
import { ProfileFormContext } from "./Provider"
import { useFormContext } from "react-hook-form"
import { cn } from "@/utils/style"
import { usePathname } from "next/navigation"

const ProfileDetails = () => {
  const pathname = usePathname()
  const { formType } = useFormContext() as ProfileFormContext
  const Form =
    formType === UserType.Individual ? IndividualForm : OrganizationForm

  return (
    <div
      className={cn("flex", !pathname.startsWith("/dashboard") && "p-4 md:p-8")}
    >
      <Form />
      {/* <ProfileTips /> */}
    </div>
  )
}

export default ProfileDetails

const ProfileTips = () => {
  const tips = [
    {
      title: "Write a compelling bio",
      description:
        "Go beyond generic statements and share specific details about your mission, values, or what drives your passion for making a difference.",
    },
    {
      title: "Provide complete location details",
      description:
        "Include your full address or at least city and state to help people understand where you're based and operating.",
    },
    {
      title: "Ensure social media links are professional",
      description:
        "Make sure your social media profiles are active, up-to-date, and represent you or your organization professionally.",
    },
    {
      title: "Upload high-quality, relevant media",
      description:
        "Choose images that showcase your work, impact, or personality rather than random or low-quality photos.",
    },
    {
      title: "Consider your contact information privacy",
      description:
        "Since your email will be visible to visitors, make sure you're comfortable with public accessibility and potential contact volume.",
    },
    {
      title: "Tailor content to your audience",
      description:
        "Write your bio and choose content that resonates with your target audience, whether they're donors, collaborators, or supporters.",
    },
    {
      title: "Balance authenticity with professionalism",
      description:
        "Let your personality shine through while maintaining a tone appropriate for your goals and potential partnerships.",
    },
  ]

  return (
    <div className="hidden md:block lg:max-w-[380px] xl:max-w-[420px] self-start bg-[#66708519] text-sm text-[#101828] rounded-lg px-5 lg:px-6 py-5 lg:py-6 ml-8 mt-[110px]">
      <p className="text-sm text-[#079455] font-bold mb-3">💡 TIPS:</p>

      <p className="mb-4">Some ideas to help you optimize your profile:</p>

      <ul className="list-disc pl-5 space-y-3 lg:space-y-4">
        {tips.map((tip, index) => (
          <li key={index} className="leading-6">
            <strong className="font-semibold">{tip.title}:</strong>
            <span className="block mt-1.5 text-[#667085]">
              {tip.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
