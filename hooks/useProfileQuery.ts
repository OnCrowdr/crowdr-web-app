"use client"
import { useQuery } from "react-query"
import _profile from "@/api/_profile"
import query from "@/api/query"

interface UseProfileQueryOptions {
  userId?: string
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
}

export const useProfileQuery = ({ 
  userId, 
  enabled = true,
  refetchOnWindowFocus = false,
  staleTime = 5 * 60 * 1000 // 5 minutes
}: UseProfileQueryOptions) => {
  return useQuery({
    queryKey: [query.keys.PROFILE, userId],
    queryFn: () => _profile.getProfile({ userId: userId! }),
    enabled: !!userId && enabled,
    refetchOnWindowFocus,
    staleTime,
  })
}