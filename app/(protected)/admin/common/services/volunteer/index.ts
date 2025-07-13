import api from "@/api"
import axios from "axios"

const getVolunteers = async (params: Partial<any>) => {
  const url = `/admin/withdrawals`

  try {
    const res = await api.get<any>(url, { params })
    return res.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred")
  }
}

export default { getVolunteers }
