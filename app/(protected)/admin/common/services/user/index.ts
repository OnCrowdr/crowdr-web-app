import { IGetUsersParams, IGetUsersResponse } from "./models/GetUsers"
import api from "@/api"
import makeRequest from "@/utils/makeRequest"
import { extractErrorMessage } from "@/utils/extractErrorMessage"

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

const deleteUser = async ({
  userId,
  adminOtp,
  authToken,
  reason = "",
  hardDelete = false,
}: {
  userId: string
  adminOtp: string
  authToken: string
  reason?: string
  hardDelete?: boolean
}) => {
  const endpoint = `/admin/users/${userId}`
  const headers = {
    "x-auth-token": authToken,
    "x-admin-otp": adminOtp,
  }

  const body = {
    reason,
    hardDelete
  }

  try {
    const { data } = await makeRequest<any>(endpoint, {
      headers,
      method: "DELETE",
      payload: JSON.stringify(body),
    })

    return data
  } catch (error) {
    const message = extractErrorMessage(error)
    throw new Error(message)
  }
}

export default { getUsers, deleteUser }
