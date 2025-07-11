"use client"
import { QueryClient, QueryClientProvider } from "react-query"
import PostHogPageView from "./_components/PostHogPageView"
import { Toaster } from "react-hot-toast"
import ModalProvider from "@/hooks/useModal"
import { RFC } from "@/types"
import UserProvider from "@/contexts/UserProvider"
import AppProvider from "@/contexts/AppProvider"

const App: RFC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <PostHogPageView />
        <Toaster position="top-right" reverseOrder={false} />
        <ModalProvider>{children}</ModalProvider>
      </AppProvider>
    </QueryClientProvider>
    // <UserProvider>
    // </UserProvider>
  )
}

export default App

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
