"use client"
import { RFC } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import query from "../../../../../../api/query"
import _profile from "../../../../../../api/_profile"
import { useUser } from "../../../../../../contexts/UserProvider"
import FormSkeleton from "../../../../../(protected)/dashboard/_components/skeletons/FormSkeleton"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Provider: RFC<Props> = ({ userId = "", children }) => {
  const form = useForm<FormFields>(config)
  const user = useUser()
  const router = useRouter()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const profileQuery = useQuery({
    queryKey: [query.keys.GET_PROFILE, userId],
    queryFn: () => _profile.getProfile({ userId }),
  })
  const profile = profileQuery.data

  const profileMutation = useMutation({
    mutationFn: _profile.updateProfile,
    onSuccess: (res) => {
      router.back()
    },
    onError: (err) => {
      toast.error("Failed to update profile")
      console.error(err)
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName:
          profile.user.userType === "individual"
            ? profile.user.fullName
            : profile.user.organizationName,
        accountType: profile.user.userType,
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        instagram: profile.instagram ?? "",
        twitter: profile.twitter ?? "",
        contactEmail: profile.user.email,
      })

      const imageUrls = profile.engagements.map((e) => e.url)
      setUploadedImages(imageUrls)
    }
  }, [profile])

  const submit = async (form: FormFields) => {
    profileMutation.mutate({
      location: form.location,
      bio: form.bio,
      twitter: form.twitter,
      instagram: form.instagram,
      engagements: form.engagingMedia,
    })
  }

  const formContext: ProfileFormContext = {
    uploadedImages,
    submitForm: form.handleSubmit(submit),
    ...form,
  }

  if (!profile) {
    return <FormSkeleton />
  }

  return <FormProvider {...formContext}>{children}</FormProvider>
}

export default Provider

interface Props {
  userId?: string
}

const config: UseFormConfig = {
  defaultValues: {
    fullName: "",
    accountType: "",
    bio: "",
    location: "",
    instagram: "",
    twitter: "",
    contactEmail: "",
    engagingMedia: [],
  },
  mode: "onChange",
}

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0]
type FormFields = {
  fullName: string
  accountType: string
  bio: string
  location: string
  instagram: string
  twitter: string
  contactEmail: string
  engagingMedia: File[]
}

export type ProfileFormContext = {
  uploadedImages: string[]
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>
} & UseFormReturn<FormFields>
