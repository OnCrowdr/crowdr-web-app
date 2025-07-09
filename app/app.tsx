"use client" // TODO: TRY TO RETURN TO SERVER COMPONENT; LOOK AT ModalProvider
import { PropsWithChildren, Suspense, useEffect } from "react"
import Head from "next/head"
import { QueryClient, QueryClientProvider } from "react-query"
import { Toaster } from "react-hot-toast"
import ModalProvider from "./common/hooks/useModal"
// import "./globals.css";
// import "./common/styles/button.css";
import mixpanel from "mixpanel-browser"
import { useRouter } from "next/router"
import { usePostHog } from "posthog-js/react"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { usePathname, useSearchParams } from "next/navigation"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

mixpanel.init("09420737b2f3103957800fa617fe2a0b", {
  /* eslint-disable camelcase */
  track_pageview: true,
  persistence: "localStorage",
  ignore_dnt: true,
})

export default function RootApp({ children }: PropsWithChildren) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <PHProvider client={posthog}>
        <SuspendedPostHogPageView />
        <ModalProvider>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </ModalProvider>
      </PHProvider>
    </QueryClientProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString()
      }

      posthog.capture("$pageview", { $current_url: url })
    }
  }, [pathname, searchParams, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
