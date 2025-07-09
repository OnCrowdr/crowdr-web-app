"use client"
import { setAuthToken } from "@/api"
import { RFC } from "@/types"
import deleteCookie from "@/utils/api/deleteCookie"
import { getUser, IUser } from "@/utils/api/user/getUser"
import setUserCookie from "@/utils/api/user/setUser"
import { setClientSideCookie } from "@/utils/cookie-setup"
import local from "@/utils/local"
import makeRequest from "@/utils/makeRequest"
import _ from "lodash"
import { createContext, use, useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

const AppProvider: RFC = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  )

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
          updateUser(sanitizedUser)
        } else {
          logout()
        }
      } catch (error) {
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    // initializeAuth()
  }, [])

  const login = async (credentials: ICredentials) => {
    try {
      const endpoint = "/users/signin"
      const { data: user } = await makeRequest<IUser>(endpoint, {
        method: "POST",
        payload: JSON.stringify(credentials),
      })

      const { token, ...sanitizedUser } = user
      // Set server-side cookie
      await setUserCookie(token)
      setClientSideCookie("token", token, 7)
      setAuthToken(token)
      updateUser(sanitizedUser)
      return sanitizedUser
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await deleteCookie("token")
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      local.removeItem(local.keys.USER)
      location.replace("/login")
    }
  }

  const updateUser = (partialUser: Partial<IUser>) => {
    const updatedUser = _.merge(structuredClone(user), partialUser)
    local.setItem(local.keys.USER, updatedUser)
    setUser(updatedUser)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }

  return (
    <AppContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  )
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
  login: (credentials: any) => Promise<Partial<IUser>>
  logout: () => void
  updateUser: (partialUser: Partial<IUser>) => void
}

interface ICredentials {
  email: string
  password: string
}
