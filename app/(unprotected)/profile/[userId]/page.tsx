"use client"
import ProfilePage from "@/app/(protected)/dashboard/profile/page"
import { useParams } from "next/navigation"
import NavBar from "../../explore/components/NavBar"
import Footer from "@/app/(homepage)/_components/layout/Footer"

const Profile = () => {
  const { userId } = useParams() as { userId: string }

  return (
    <div className="font-satoshi">
      <NavBar />
      <ProfilePage userId={userId} />
      <Footer />
    </div>
  )
}

export default Profile
