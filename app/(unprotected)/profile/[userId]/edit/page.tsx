"use client"
import { useParams, useRouter } from "next/navigation"
import Provider from "./_components/Provider"
import { useQuery } from "react-query"
import query from "../../../../../api/query"
import _profile from "../../../../../api/_profile"
import ProfileDetails from "./_components/ProfileDetails"
import { useAuth } from "@/contexts/AppProvider"
import { useEffect } from "react"

const EditProfile = () => {
  const router = useRouter()
  const { userId } = useParams() as { userId: string }
  const { user } = useAuth()

  useEffect(() => {
    if (user && user._id !== userId) {
      router.replace("/explore")
    }
  }, [user])

  return (
    <Provider userId={userId}>
      <ProfileDetails />
    </Provider>
  )
}

export default EditProfile
