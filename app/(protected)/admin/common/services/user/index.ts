import axios from "axios"
import { IGetUsersParams, IGetUsersResponse } from "./models/GetUsers"
import api from "@/api"

const getUsers = async (params: Partial<IGetUsersParams> = {}) => {
  const url = `/admin/users`

  type Key = keyof IGetUsersParams
  for (let key in params) {
    if (params[key as Key] == null || params[key as Key] === "") {
      delete params[key as Key]
    }
  }

  try {
    const res = await api.get<IGetUsersResponse>(url, { params })
    return res.data.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred")
  }
}

export default { getUsers }
