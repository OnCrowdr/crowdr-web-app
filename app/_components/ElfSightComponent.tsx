import { isProd } from "@/config"
import Script from "next/script"

export const ElfSightScript = () => {
  return (
    isProd && (
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="afterInteractive"
        async
      />
    )
  )
}

export const ElfSightApp = () => {
  return (
    isProd && (
      <div
        className="elfsight-app-89621f74-d856-4133-9f3c-dcaedfbe0522"
        data-elfsight-app-lazy
      />
    )
  )
}
