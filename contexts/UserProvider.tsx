import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { atom, useAtom } from "jotai"
import { API_BASE_URL } from "../config"

import { RFC } from "@/types"
import { IUser, getUser } from "../utils/api/user/getUser"
import local from "@/utils/local"
import { setAuthToken } from "@/api"

const UserContext = createContext<IUser | null>(null)
export const userAtom = atom<IUser | null>(null)

const UserProvider: RFC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    getUser().then((user) => {
      if (user) {
        // axios.defaults.headers.common["x-auth-token"] = user.token
        setAuthToken(user.token ?? "")
        local.setItem(local.keys.USER, user)
      }

      setUser(user)
    })
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export default UserProvider

export const useUser = () => {
  return useContext(UserContext)
}

type UserProviderProps = {
  children: React.ReactNode
}

axios.defaults.baseURL = `${API_BASE_URL}`
