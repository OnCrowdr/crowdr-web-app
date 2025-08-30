import { useQuery } from "react-query"
import makeRequest from "../utils/makeRequest"

export interface Bank {
  name: string
  code: string
  currency: string
}

interface BanksResponse {
  success: boolean
  message: string
  data: Bank[]
}

export const useBanks = () => {
  return useQuery<Bank[], Error>({
    queryKey: ["banks"],
    queryFn: async (): Promise<Bank[]> => {
      const response = await makeRequest<BanksResponse>("/payments/banks", {
        method: "GET",
      })
      return response.data || []
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - banks don't change frequently
    cacheTime: 1000 * 60 * 60, // 1 hour
  })
}