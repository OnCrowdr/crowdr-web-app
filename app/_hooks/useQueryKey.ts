"use client"
import { useUser } from "../(protected)/dashboard/_common/hooks/useUser"

const useQueryKey = () => {
  const user = useUser()

  const queryKey = (...queryKey: any[]) => {
    return user ? [...queryKey, user._id] : queryKey
  }

  return queryKey
}

export default useQueryKey
