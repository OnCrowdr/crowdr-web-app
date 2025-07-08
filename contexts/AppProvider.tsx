"use client"
import { RFC } from "@/types"
import { IUser } from "@/utils/api/user/getUser"
import { createContext, Dispatch, SetStateAction, use, useState } from "react"

const AppContext = createContext({} as IAppContext)
export const useAppContext = () => use(AppContext)

const AppProvider: RFC = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider

interface IAppContext {
  user: IUser | null
  setUser: Dispatch<SetStateAction<IUser | null>>
}
