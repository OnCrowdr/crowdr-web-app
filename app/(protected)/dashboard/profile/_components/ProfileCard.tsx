"use client"
import {
  Instagram,
  Link as LinkIcon,
  Mail,
  Twitter,
  Camera,
} from "lucide-react"
import { IGetProfileResponseData } from "@/api/_profile/models/GetProfile"
import { RFC, UserType } from "@/types"
import toast from "react-hot-toast"
import { RiEditLine } from "react-icons/ri"
import Link from "next/link"
import Text from "../../_components/Text"
import { useAuth } from "@/contexts/AppProvider"
import { PLACEHOLDER_IMAGE, PLACEHOLDER_PROFILE_IMAGE } from "@/lib/constants"
import UploadModal from "./UploadModal"
import { useFileDialog } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { cn } from "@/utils/style"
import { useMutation, useQueryClient } from "react-query"
import _profile from "@/api/_profile"
import { errorHandler } from "@/lib/error"
import query from "@/api/query"

const ProfileCard: RFC<Props> & { Skeleton: RFC } = ({ profile }) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [coverPhoto, setCoverPhoto] = useState<File>()
  const [profilePhoto, setProfilePhoto] = useState<File>()

  const profileMutation = useMutation({
    mutationFn: _profile.updateProfile,
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: [query.keys.PROFILE, user?._id] })
      toast.success(data.message)
    },
    onError: errorHandler,
  })

  const isOwnProfile = user?._id === profile.user._id
  const profileName =
    profile.user.userType === "individual"
      ? profile.user.fullName
      : profile.user.organizationName

  const socials = (
    [
      profile.user.email && {
        type: "email",
        url: `mailto:${profile.user.email}`,
        icon: Mail,
      },
      profile.instagram && {
        type: "instagram",
        url: profile.instagram,
        // url: `https://instagram.com/${profile.instagram}`,
        icon: Instagram,
      },
      profile.twitter && {
        type: "twitter",
        url: profile.twitter,
        // url: `https://twitter.com/${profile.twitter}`,
        icon: Twitter,
      },
    ] as any[]
  )
    .filter((social) => social !== null && social !== "")
    .map((social) => ({
      ...social,
      ...(social?.type !== "email" && {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    }))

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(
        `https://oncrowdr.com/profile/${profile?.user?._id}`
      )
      toast.success("Copied", { position: "top-center" })
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const uploadPhoto = (key: "image" | "backgroundImage", file?: File) => {
    if (!file) return

    if (key === "image") {
      setProfilePhoto(file)
    }
    if (key === "backgroundImage") {
      setCoverPhoto(file)
    }

    profileMutation.mutate({
      [key]: file,
    })
  }

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden border border-[#0000001A] mb-8">
        {/* Cover photo */}
        {/* <div className="relative h-[93px] sm:h-36 md:h-64 w-full bg-gray-200">
          <img
            src={profile.backgroundImage?.url ?? PLACEHOLDER_IMAGE}
            alt={profileName}
            className="h-full w-full object-cover"
          />

          {isOwnProfile && (
            <PhotoButton
              onSelect={(file) => uploadPhoto("backgroundImage", file)}
              className="absolute top-[12px] right-[13px] md:top-[17px] md:right-[18px]"
            />
          )}
        </div> */}

        {/* Profile section */}
        <div className="p-3 md:p-6">
          <div className="flex flex-col sm:flex-row md:items-center justify-between flex-wrap">
            <div className="flex items-start mb-4 md:mb-0">
              {/* <div
                className={cn(
                  "relative rounded-full bg-gray-200 mr-4 flex-shrink-0",
                  "-mt-[30px] h-[80px] w-[80px]",
                  "sm:-mt-[40px] sm:h-[105px] sm:w-[105px]",
                  "md:-mt-[50px] md:h-[140px] md:w-[140px]"
                )}
              >
                <img
                  src={profile.image?.url ?? PLACEHOLDER_PROFILE_IMAGE}
                  alt={profileName}
                  width={64}
                  height={64}
                  className="w-full h-full rounded-full border-2 sm:border-[3px] md:border-4 border-white object-cover"
                />

                {isOwnProfile && (
                  <PhotoButton
                    onSelect={(file) => uploadPhoto("image", file)}
                    className="absolute -bottom-[4px] -right-[5px] md:bottom-[4px] md:right-[5px]"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center md:mb-1">
                  <h1 className="text-[12.5px] md:text-xl font-bold mr-2">
                    {profileName}
                  </h1>
                </div>
                <p className="text-[11.25px] md:text-sm text-gray-600 md:mb-2 capitalize">
                  {profile.user.userType === UserType.Individual
                    ? "Individual"
                    : "Organization"}
                </p>
                <button
                  onClick={handleCopyLink}
                  className="text-[#00B964] flex items-center text-[11.25px] md:text-sm hover:underline"
                >
                  Profile Link
                  <LinkIcon size={14} color="#00B964" className="ml-1" />
                </button>
              </div> */}
            </div>

            {/* <div className="flex items-center gap-[14px]">
              {isOwnProfile && (
                <Link
                  href={`/dashboard/profile/edit`}
                  className="flex items-center gap-2 text-sm md:text-base text-[#00B964] bg-[#00b96314] hover:bg-[#00b9631f] rounded-full transition-colors h-8 md:h-10 px-3 md:px-[14px]"
                >
                  <RiEditLine
                    fill="#00B964"
                    className="h-[18px] w-[18px] md:h-6 md:w-6"
                  />
                  Edit Profile
                </Link>
              )}

              <div className="flex space-x-2">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full border border-gray-200"
                    target="_blank"
                  >
                    <social.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                ))}
              </div>
            </div> */}
          </div>

          {/* Bio section */}
          {profile.bio && (
            <div className="mt-8">
              <h2 className="text-sm md:text-base font-semibold mb-2">Bio</h2>
              <Text
                characterLimit={300}
                toggle
                className="text-xs md:text-sm text-gray-700"
              >
                {profile.bio}
              </Text>
            </div>
          )}
        </div>
      </div>

      <UploadModal
        file={coverPhoto || profilePhoto}
        opened={profileMutation.isLoading}
        onClose={() => {
          setCoverPhoto(undefined)
          setProfilePhoto(undefined)
        }}
      />
    </>
  )
}

export default ProfileCard

interface Props {
  profile: IGetProfileResponseData
}

ProfileCard.Skeleton = () => {
  return (
    // Main card with cover photo and organization info
    <div className="rounded-xl overflow-hidden border border-gray-100 mb-8">
      {/* Cover photo with logo */}
      <div className="relative h-64 w-full bg-gray-200"></div>
      {/* Profile section */}
      <div className="p-6">
        <div className="flexspace-x-4 flex gap-x-4">
          <div className="size-16 h-16 w-16 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-6 py-1 max-w-[200px]">
            <div className="space-y-3">
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
              </div>
              <div className="h-2 rounded bg-gray-200 max-w-[100px]"></div>
            </div>
          </div>
        </div>

        {/* Bio section */}
        <div className="mt-8 space-y-3">
          <div className="h-2 rounded bg-gray-200"></div>
          <div className="h-2 rounded bg-gray-200"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-gray-200"></div>
            <div className="col-span-1 h-2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PhotoButton: RFC<PhotoButtonProps> = ({ className, onSelect }) => {
  const fileDialog = useFileDialog({ multiple: false, accept: "image/*" })
  const pickedFiles = Array.from(fileDialog.files || [])

  useEffect(() => {
    if (pickedFiles.length !== 0) {
      const [photo] = pickedFiles
      onSelect(photo)
      fileDialog.reset()
    }
  }, [pickedFiles])

  return (
    <button
      onClick={fileDialog.open}
      className={cn(
        "flex items-center justify-center bg-white hover:bg-[#f4f4f4] rounded-full transition-colors h-8 w-8 md:h-10 md:w-10",
        className
      )}
    >
      <Camera stroke="#667085" className="h-5 w-5 md:h-[26px] md:w-[26px]" />
    </button>
  )
}

interface PhotoButtonProps {
  className?: string
  onSelect: (photo: File) => void
}
