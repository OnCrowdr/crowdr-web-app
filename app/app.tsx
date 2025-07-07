"use client"
import { QueryClient, QueryClientProvider } from "react-query"
import PostHogPageView from "./_components/PostHogPageView"
import { Toaster } from "react-hot-toast"
import ModalProvider from "@/hooks/useModal"
import { RFC } from "@/types"
import UserProvider from "@/contexts/UserProvider"

const App: RFC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PostHogPageView />
        <Toaster position="top-right" reverseOrder={false} />
        <ModalProvider>{children}</ModalProvider>
      </UserProvider>
    </QueryClientProvider>
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
