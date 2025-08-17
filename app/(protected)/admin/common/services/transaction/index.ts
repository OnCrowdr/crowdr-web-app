import axios from "axios"
import { IGetTransactionsParams, IGetTransactionsResponse } from "./models/GetTransactions"
import api from "@/api"

const getTransactions = async (params: Partial<IGetTransactionsParams> = {}) => {
  const url = `/admin/transactions`

  type Key = keyof IGetTransactionsParams
  for (let key in params) {
    if (params[key as Key] == null || params[key as Key] === "") {
      delete params[key as Key]
    }
  }

  try {
    const res = await api.get<IGetTransactionsResponse>(url, { params })
    return res.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred")
  }
}

export default { getTransactions }