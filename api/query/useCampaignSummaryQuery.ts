"use client"
import { useQuery, useQueryClient } from "react-query"
import keys from "./keys"
import _my_campaigns from "../_my_campaigns"
import { useEffect, useState } from "react"
import _campaigns from "../_campaigns"
import { IGetCampaignsSummaryParams } from "../_campaigns/models/GetCampaignsSummary"

const useCampaignSummaryQuery = ({ params, enableQuery = true }: Props) => {
  const queryClient = useQueryClient()
  const queryKey = [keys.CAMPAIGN_SUMMARY, { ...params }]
  const [data, setData] = useState<typeof query.data>()

  const query = useQuery({
    queryKey,
    queryFn: () => _campaigns.getCampaignSummary(params),
    refetchOnWindowFocus: false,
    enabled: enableQuery,
  })

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event &&
        event.query.queryKey[0] === queryKey[0] &&
        event.type === "queryUpdated"
      ) {
        setData(event.query.state.data)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryKey, queryClient])

  return { query, data }
}

export default useCampaignSummaryQuery

interface Props {
  params: IGetCampaignsSummaryParams
  enableQuery?: boolean
}
