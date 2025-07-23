import { isProd } from "@/config"
import Script from "next/script"

const ElfSightScript = () => {
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

const ElfSightBody = () => {
  return (
    isProd && (
      <div
        className="elfsight-app-89621f74-d856-4133-9f3c-dcaedfbe0522"
        data-elfsight-app-lazy
      />
    )
  )
}

export default {
  Body: ElfSightBody,
  Script: ElfSightScript,
}
