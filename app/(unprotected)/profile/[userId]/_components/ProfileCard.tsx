"use client"
import { Edit, ExternalLink, Instagram, Link as LinkIcon, Link2, Mail, Twitter } from "lucide-react"
import Image from "next/image"
import { IGetProfileResponseData } from "../../../../../api/_profile/models/GetProfile"
import { RFC } from "../../../../common/types"
import toast from "react-hot-toast"
import { useUser } from "../../../../(protected)/dashboard/_common/hooks/useUser"
import { RiEditLine } from "react-icons/ri"
import Link from "next/link"
import Text from "../../../../(protected)/dashboard/_components/Text"

const ProfileCard: RFC<Props> & { Skeleton: RFC } = ({ profile }) => {
  const user = useUser()
  const isOwnProfile = user?._id === profile.user._id
  const profileName =
    profile.user.userType === "individual"
      ? profile.user.fullName
      : profile.user.organizationName

  const socials = ([
    profile.user.email && {
      type: "email",
      url: `mailto:${profile.user.email}`,
      icon: Mail,
    },
    profile.instagram && {
      type: "instagram",
      url: `https://instagram.com/${profile.instagram}`,
      icon: Instagram,
    },
    profile.twitter && {
      type: "twitter",
      url: `https://twitter.com/${profile.twitter}`,
      icon: Twitter,
    },
  ] as any[])
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
      toast.success("Copied")
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#0000001A] mb-8">
      {/* Cover photo with logo */}
      <div className="relative h-64 w-full bg-pink-100">
        <img
          src={
            profile.image?.url ??
            "https://reactplay.io/static/media/placeholder_cover.ea7b18e0704561775829.jpg"
          }
          alt={profileName}
          className="h-full w-full object-cover"
        />
        {/* <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/beauty-hut-logo.svg"
                  alt="Beauty Hut"
                  width={280}
                  height={180}
                />
              </div> */}
      </div>

      {/* Profile section */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-start mb-4 md:mb-0">
            <div className="h-16 w-16 rounded-full bg-pink-100 mr-4 flex-shrink-0">
              <img
                src={
                  profile.image?.url ??
                  "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"
                }
                alt={profileName}
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center mb-1">
                <h1 className="text-xl font-bold mr-2">{profileName}</h1>
                {/* TODO: uncomment when country feature is added */}
                {/* <span className="text-sm bg-gray-100 text-gray-800 px-1 py-0.5 rounded">
                        🇺🇸
                      </span> */}
              </div>
              <p className="text-gray-600 mb-2 capitalize">
                {profile.user.userType}
              </p>
              <button
                onClick={handleCopyLink}
                className="text-[#00B964] flex items-center text-sm hover:underline"
              >
                Profile Link
                <LinkIcon size={14} color="#00B964" className="ml-1" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[14px]">
            {isOwnProfile && (
              <Link
                href={`/profile/${profile.user._id}/edit`}
                className="flex items-center gap-2 text-[#00B964] bg-[#00b96314] hover:bg-[#00b9631f] rounded-full transition-colors h-10 px-[14px]"
              >
                <RiEditLine size={24} fill="#00B964" /> Edit Profile
              </Link>
            )}

            <div className="flex space-x-2">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bio section */}
        {profile.bio && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Bio</h2>
            <Text characterLimit={300} toggle className="text-gray-700">
              {profile.bio}
            </Text>
          </div>
        )}
      </div>
    </div>
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
  );
}
