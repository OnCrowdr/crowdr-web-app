import api from ".."
import { PaginationParams } from "../types"
import { IDeleteCampaignPath } from "./models/DeleteCampaign"
import { IGetCamapaignPath } from "./models/GetCampaign"
import { IPatchEndCampaignPath } from "./models/PatchEndCampaign"
import { IGetCampaignsResponse } from "../_campaigns/models/GetCampaigns"
import { IGetCampaignsSummaryResponse } from "../_campaigns/models/GetCampaignsSummary"
import { IGetCampaignsSummaryParams } from "./models/CampaignsSummary"
import { IGetCampaignResponse } from "../_campaigns/models/GetCampaign"

const getCampaigns = async (params: PaginationParams = {}) => {
  const url = `/my-campaigns`
  params.perPage ??= 6

  try {
    const { data } = await api.get<IGetCampaignsResponse>(url, { params })
    return data.data
  } catch (error) {
    throw error
  }
}

const getCampaign = async ({ campaignId }: IGetCamapaignPath) => {
  const url = `/my-campaigns/${campaignId}`

  try {
    const { data } = await api.get<IGetCampaignResponse>(url)
    return data.data
  } catch (error) {
    throw error
  }
}

const deleteCampaign = async ({ id }: IDeleteCampaignPath) => {
  const url = `/my-campaigns/${id}`

  try {
    const { data } = await api.delete(url)
    return data
  } catch (error) {
    throw error
  }
}

const endCampaign = async ({ id }: IPatchEndCampaignPath) => {
  const url = `/my-campaigns/end/${id}`

  try {
    const { data } = await api.patch(url)
    return data
  } catch (error) {
    throw error
  }
}

const getCampaignsSummary = async (params: IGetCampaignsSummaryParams = {}) => {
  const url = `/my-campaigns/summary`

  try {
    const { data } = await api.get<IGetCampaignsSummaryResponse>(url, {
      params,
    })
    return data.data
  } catch (error) {
    throw error
  }
}

export default {
  getCampaigns,
  getCampaign,
  deleteCampaign,
  endCampaign,
  getCampaignsSummary,
}
