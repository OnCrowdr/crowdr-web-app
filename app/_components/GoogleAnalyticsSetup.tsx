"use client"

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"
import { ErrorBoundary } from "../../components/ErrorBoundary"

const GoogleAnalyticsSetup = () => {
  return (
    <>
      <ErrorBoundary>
        <GoogleTagManager gtmId="GTM-N95QRZ5K" />
      </ErrorBoundary>
      <GoogleAnalytics gaId="G-JL3VDJ3QRX" />
    </>
  )
}

export default GoogleAnalyticsSetup
