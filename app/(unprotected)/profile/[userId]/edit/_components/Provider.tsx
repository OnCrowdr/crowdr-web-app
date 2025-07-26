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
import {
  IGetProfileResponseData,
  Member,
} from "@/api/_profile/models/GetProfile"
import { useMap, useSet } from "@mantine/hooks"
import { urlToFile } from "@/utils"

const Provider: RFC<Props> = ({ userId = "", children }) => {
  const form = useForm<FormFields>(config)
  const { user } = useAuth()
  const router = useRouter()
  const deletedMedia = useMap<string, MediaType>()
  const [formType, setFormType] = useState(UserType.Individual)

  const profileQuery = useAuthQuery({
    queryKey: [query.keys.PROFILE, userId],
    queryFn: () => _profile.getProfile({ userId }),
    enabled: !!userId || userId === user?._id,
  })

  const profile = profileQuery.data
  const profileMutation = useMutation(_profile.updateProfile)
  const deleteMediaMutation = useMutation(_profile.deleteMedia)

  useEffect(() => {
    if (profile) {
      const initProfile = async () => {
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
          engagingMedia: [],
          members: [EMPTY_MEMBER],
        })

        if (profile.members.length) {
          const mappedMembers = await mapMembersToView(profile.members)
          form.setValue("members", mappedMembers)
        }
      }

      const mapMembersToView = async (members: Member[]) => {
        const membersPromises = members.map(async (member) => {
          let photo: File | undefined

          try {
            photo = member.image
              ? await urlToFile(
                  member.image.url,
                  member.fullname.replace(/\s+/g, "-").toLowerCase() + ".jpg"
                )
              : undefined
          } catch (error) {
            console.error("Failed to convert image URL to File:", error)
          }

          return {
            mediaUrl: member.image?.url,
            fullname: member.fullname,
            position: member.position,
            photo: [photo] as any, // Cast to File[]
          }
        })

        const mappedMembers = await Promise.all(membersPromises)
        return mappedMembers
      }

      initProfile()
    }
  }, [profile])

  const submit = async (form: FormFields) => {
    try {
      // always clear out existing member media on each profile update
      // because the media are always uploaded anew
      for (const mediaId of profile?.members.map((m) => m.image?.id) ?? []) {
        if (mediaId) {
          deletedMedia.set(mediaId, 'members')
        }
      }

      for (const [mediaId, type] of deletedMedia.entries()) {
        await deleteMediaMutation.mutateAsync({ mediaId, column: type })
      }

      await profileMutation.mutateAsync({
        location: form.location,
        bio: form.bio,
        twitter: form.twitter,
        instagram: form.instagram,
        engagements: form.engagingMedia,
        membersImages: form.members.flatMap((m) => m.photo!),
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
    deletedMedia,
    formType,
    profile,
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
    photo: File | undefined
    mediaUrl?: string // Optional, used for existing members
  }[]
}

export type ProfileFormContext = {
  deletedMedia: Map<string, MediaType>
  formType: UserType
  profile: IGetProfileResponseData | undefined
  setFormType: Dispatch<SetStateAction<UserType>>
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>
} & UseFormReturn<FormFields>

type MediaType = "engagements" | "members"
