"use client"
import Provider from "./_components/Provider"
import _profile from "../../../../../api/_profile"
import ProfileDetails from "./_components/ProfileDetails"
import { useAuth } from "@/contexts/AppProvider"

const EditProfile = () => {
  const { user } = useAuth()

  return (
    <Provider userId={user?._id}>
      <ProfileDetails />
    </Provider>
  )
}

export default EditProfile
