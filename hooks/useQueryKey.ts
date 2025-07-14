"use client"
import { useAuth } from "@/contexts/AppProvider"

const useQueryKey = () => {
  const { user } = useAuth()

  const queryKey = (...queryKey: any[]) => {
    return user ? [...queryKey, user._id] : queryKey
  }

  return queryKey
}

export default useQueryKey
