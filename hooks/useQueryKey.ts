"use client"
import { useUser } from "@/contexts/UserProvider"

const useQueryKey = () => {
  const user = useUser()

  const queryKey = (...queryKey: any[]) => {
    return user ? [...queryKey, user._id] : queryKey
  }

  return queryKey
}

export default useQueryKey
