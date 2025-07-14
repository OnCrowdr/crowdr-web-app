"use client"
import { useAuth } from "@/contexts/AppProvider"
import { QueryKey, useQuery, UseQueryOptions } from "react-query"

export const useAuthQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) => {
  const { isAuthenticated, user } = useAuth()
  const queryKey = user
    ? Array.isArray(options.queryKey)
      ? [...options.queryKey, user._id]
      : [options.queryKey, user._id]
    : options.queryKey

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryKey: queryKey as TQueryKey,
    enabled: isAuthenticated && options.enabled !== false,
  })
}
