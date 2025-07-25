"use client"
import suspense from "@/utils/suspense"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { usePostHog } from "posthog-js/react"
import { useEffect } from "react"

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // const posthog = usePostHog()

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

export default suspense(PostHogPageView)
