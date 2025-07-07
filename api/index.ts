import axios from "axios"
import { API_BASE_URL } from "../config"
import { IUser } from "../utils/api/user/getUser"
import deleteCookie from "@/utils/api/deleteCookie"
import toast from "react-hot-toast"

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem("USER")
    const user = userJson ? (JSON.parse(userJson) as IUser) : null
    if (user && user.token) {
      config.headers["x-auth-token"] = user.token
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (config) => config,
  async (err) => {
    if (err.status === 401 && location.pathname !== "/login") {
      toast.error("Session expired")
      await deleteCookie("token")
      location.replace("/login")
      localStorage.removeItem("USER")
    }

    return Promise.reject(err)
  }
)

export default api
