import axios from "axios"
import { API_BASE_URL } from "../config"
import { getToken, IUser } from "../utils/api/user/getUser"
import deleteCookie from "@/utils/api/deleteCookie"
import toast from "react-hot-toast"
import local from "@/utils/local"

let authToken: string | null = null

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(
  async (config) => {
    // const userJson = localStorage.getItem("USER")
    // const user = userJson ? (JSON.parse(userJson) as IUser) : null
    // if (user && user.token) {
    //   config.headers["x-auth-token"] = user.token
    // }
    if (!authToken) {
      authToken = (await getToken()) ?? null
    } else {
      config.headers["x-auth-token"] = authToken
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (config) => config,
  async (err) => {
    if (err.status === 401 && location.pathname !== "/login") {
      try {
        toast.error("Session expired")
        await deleteCookie("token")
      } finally {
        // localStorage.removeItem("USER")
        local.removeItem(local.keys.USER)
        location.assign("/login")
      }
    }

    return Promise.reject(err)
  }
)

export default api

export const setAuthToken = (token: string) => {
  authToken = token
}
