"use client"
import ProfilePage from "@/app/(protected)/dashboard/profile/page"
import { useParams } from "next/navigation"

const Profile = () => {
  const { userId } = useParams() as { userId: string }

  return <ProfilePage userId={userId} />
}

export default Profile
