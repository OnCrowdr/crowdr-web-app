"use client"
import { RFC } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import query from "../../../../../../api/query"
import _profile from "../../../../../../api/_profile"
import { useUser } from "../../../../../../contexts/UserProvider"
import FormSkeleton from "../../../../../(protected)/dashboard/_components/skeletons/FormSkeleton"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useAuth } from "@/contexts/AppProvider"
import { UserType } from "@/types"
import { useAuthQuery } from "@/hooks/useAuthQuery"
import { errorHandler } from "@/lib/error"

const Provider: RFC<Props> = ({ userId = "", children }) => {
  const form = useForm<FormFields>(config)
  const { user } = useAuth()
  const router = useRouter()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [formType, setFormType] = useState(UserType.Individual)

  const profileQuery = useAuthQuery({
    queryKey: [query.keys.PROFILE, userId],
    queryFn: () => _profile.getProfile({ userId }),
    enabled: !!userId || userId === user?._id,
  })

  const profile = profileQuery.data
  const profileMutation = useMutation(_profile.updateProfile)

  useEffect(() => {
    if (profile) {
      form.reset({
        accountName:
          profile.user.userType === "individual"
            ? profile.user.fullName
            : profile.user.organizationName,
        accountType: profile.user.userType,
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        instagram: profile.instagram ?? "",
        twitter: profile.twitter ?? "",
        contactEmail: profile.user.email,
        members: profile.members.length ? profile.members : [EMPTY_MEMBER],
        engagingMedia: [],
      })
      
      const imageUrls = profile.engagements.map((e) => e.url)
      setUploadedImages(imageUrls)
    }
  }, [profile])

  const submit = async (form: FormFields) => {
    try {
      await profileMutation.mutateAsync({
        location: form.location,
        bio: form.bio,
        twitter: `https://twitter.com/${form.twitter}`,
        instagram: `https://instagram.com/${form.instagram}`,
        engagements: form.engagingMedia,
        membersImages: form.members.flatMap((m) => m.photo),
        members: form.members.map((m) => ({
          fullname: m.fullname,
          position: m.position,
        })),
      })

      router.push(`/profile/${userId}`)
    } catch (error: any) {
      errorHandler(error)
      console.error(error)
    }
  }

  const formContext: ProfileFormContext = {
    uploadedImages,
    formType,
    setFormType,
    submitForm: form.handleSubmit(submit),
    ...form,
  }

  if (!profile) {
    return (
      <div className="p-4 md:p-8">
        <hgroup className="border-b border-b-[#E3E3E3] pb-4 mb-10">
          <h1 className="text-2xl mb-0.5">Edit Profile</h1>
          <p className="text-sm text-[#61656B]">
            Be sure to save your changes.
          </p>
        </hgroup>
        <FormSkeleton />
      </div>
    )
  }

  return <FormProvider {...formContext}>{children}</FormProvider>
}

export default Provider

interface Props {
  userId?: string
}

export const EMPTY_MEMBER = {
  fullname: "",
  position: "",
  photo: undefined as any as File,
}

const config: UseFormConfig = {
  // defaultValues: {
  //   accountName: "",
  //   accountType: "",
  //   bio: "",
  //   location: "",
  //   instagram: "",
  //   twitter: "",
  //   contactEmail: "",
  //   engagingMedia: [],
  //   members: [EMPTY_MEMBER],
  // },
  mode: "onChange",
}

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0]
type FormFields = {
  accountName: string
  accountType: string
  bio: string
  location: string
  instagram: string
  twitter: string
  contactEmail: string
  engagingMedia: File[]
  members: {
    fullname: string
    position: string
    photo: File
  }[]
}

export type ProfileFormContext = {
  uploadedImages: string[]
  formType: UserType
  setFormType: Dispatch<SetStateAction<UserType>>
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>
} & UseFormReturn<FormFields>
