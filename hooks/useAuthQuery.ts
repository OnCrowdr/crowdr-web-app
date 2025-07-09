"use client"
import { useAuth } from "@/contexts/AppProvider"
import { useQuery, UseQueryOptions } from "react-query"

export const useAuthQuery = (options: UseQueryOptions) => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    ...options,
    enabled: isAuthenticated && options.enabled !== false,
  })
}
