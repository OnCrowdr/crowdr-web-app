import objectToFormData from "@/utils/objectToFormData"
import api from ".."
import { IGetKycResponse } from "./models/GetKyc"
import { IPutUpdateKycBody } from "./models/PutUpdateKyc"
import { BaseResponse } from "../types"

const getKyc = async () => {
  const url = `/settings/KYC`

  try {
    const { data } = await api.get<IGetKycResponse>(url)
    return data.data
  } catch (error) {
    throw error
  }
}

const updateKyc = async (body: IPutUpdateKycBody) => {
  const url = `/settings/KYC`
  const formData = objectToFormData(body)

  try {
    const { data } = await api.putForm<BaseResponse>(url, formData)
    return data
  } catch (error) {
    throw error
  }
}

export default { getKyc, updateKyc }
