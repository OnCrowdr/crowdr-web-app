"use client"
import { setAuthToken } from "@/api"
import _users from "@/api/_users"
import {
  IPostSignInError,
  IPostSignInResponseData,
} from "@/api/_users/models/PostSignIn"
import { UserType } from "@/types"
import { useToast } from "@/hooks/useToast"
import { isAxiosError } from "@/lib/error"
import { DistributiveOmit, RFC } from "@/types"
import deleteCookie from "@/utils/api/deleteCookie"
import { getUser } from "@/utils/api/user/getUser"
import setUserCookie from "@/utils/api/user/setUser"
import { setClientSideCookie } from "@/utils/cookie-setup"
import { handleUserRedirection } from "@/utils/handleUserRedirection"
import local from "@/utils/local"
import { Mixpanel } from "@/utils/mixpanel"
import _ from "lodash"
import { useRouter } from "next/navigation"
import { createContext, use, useEffect, useState } from "react"
import { useMutation } from "react-query"

const AppProvider: RFC = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const toast = useToast()

  const loginMutation = useMutation(_users.signin)

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = local.getItem<IUser>(local.keys.USER)
      if (storedUser) {
        setUser(storedUser)
      }

      try {
        const user = await getUser()

        if (user) {
          const { token, ...sanitizedUser } = user
          setAuthToken(token)
          updateUser(user)
        } else {
          logout()
        }
      } catch (error) {
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: ICredentials) => {
    Mixpanel.track("Login clicked")

    try {
      const user = await loginMutation.mutateAsync(credentials)
      const { token, ...sanitizedUser } = user
      await setUserCookie(token) // Set server-side cookie
      setClientSideCookie("token", token, 7)
      setAuthToken(token)
      updateUser(user)
      handleUserRedirection(user, router.push)
    } catch (error: any) {
      Mixpanel.track("Login failed")

      if (isAxiosError<IPostSignInError>(error)) {
        const err = error.response.data


        if (err.error === "EMAIL_NOT_VERIFIED") {
          router.push(`/confirmation?email=${err.email}`)
          toast({ title: err.message, body: err.solution, type: "error" })
        } else {
          toast({ title: err.message, type: "error" })
        }
      } else {
        toast({ title: error.response.data.message, type: "error" })
      }
    }
  }

  const logout = async () => {
    try {
      await deleteCookie("token")
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      local.removeItem(local.keys.USER)
    }
  }

  const updateUser = (partialUser: Partial<IUser>) => {
    const { token, ...updatedUser } = _.merge(
      structuredClone(user),
      partialUser
    )
    local.setItem(local.keys.USER, updatedUser)
    setUser({ token, ...updatedUser })
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider

const AppContext = createContext({} as IAppContext)
export const useAuth = () => {
  const context = use(AppContext)
  if (!context) {
    throw new Error("useAuth must be used within an AppProvider")
  }
  return context
}

interface IAppContext {
  user: IUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: any) => Promise<void>
  logout: () => Promise<void>
  updateUser: (partialUser: Partial<IUser>) => void
}

type IUser = IPostSignInResponseData
// type IUser = DistributiveOmit<IPostSignInResponseData, "token">

interface ICredentials {
  email: string
  password: string
}
