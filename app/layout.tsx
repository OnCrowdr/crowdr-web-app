import { PropsWithChildren } from "react"
import type { Metadata } from "next"
import { Public_Sans } from "next/font/google"
import localFont from "next/font/local"
import "@/styles/globals.css"
import "@/styles/button.css"
import "react-loading-skeleton/dist/skeleton.css"

import App from "./app"
import GoogleAnalyticsSetup from "./_components/GoogleAnalyticsSetup"
import ElfSight from "./_components/ElfSight"

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>

      <GoogleAnalyticsSetup />
      <ElfSight.Script />

      <body className={`${satoshi.variable} ${inter.className}`}>
        <App children={children} />
        <ElfSight.Body />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    template: "%s | Crowdr",
    default: "Crowdr - Crowdfund in Nigeria",
  },

  applicationName: "Crowdr",

  keywords: [
    "crowdfunding",
    "donate",
    "volunteer",
    "charity",
    "NGO",
    "non-profit",
    "fundraising",
    "donation",
    "volunteering",
    "Nigeria",
    "Africa",
    "Crowdfunding in Nigeria",
    "Crowdfunding in Africa",
  ],

  description:
    "Crowdr is the Gofundme alternative makes fundraising easy for individuals, NGOs, and businesses in Nigeria. Start your crowdfunding campaign today.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.oncrowdr.com/",
    siteName: "Crowdr",
    title: "Crowdr - Crowdfund in Nigeria",
    description:
      "Crowdr is the Gofundme alternative makes fundraising easy for individuals, NGOs, and businesses in Nigeria. Start your crowdfunding campaign today.",
    images: [
      {
        url: "https://res.cloudinary.com/dqx8jfcj0/image/upload/v1713100843/crowdr_wordmark_png-GREEN_weutm8.png",
        alt: "Crowdr logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@oncrowdr",
    creator: "@oncrowdr",
    images:
      "https://res.cloudinary.com/dqx8jfcj0/image/upload/v1713100843/crowdr_wordmark_png-GREEN_weutm8.png",
    description:
      "Crowdr is the Gofundme alternative makes fundraising easy for individuals, NGOs, and businesses in Nigeria. Start your crowdfunding campaign today.",
  },

  appleWebApp: {
    statusBarStyle: "default",
    capable: true,
    title: "Crowdr - Crowdfund in Nigeria",
  },

  verification: {
    google: "9Yb3G9DGqrNGVcr7mLbrpoIRZD6Kj4YHixwQileL0EI",
  },
}

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/Satoshi-Medium.otf",
      weight: "500",
    },
    {
      path: "../public/fonts/Satoshi-Bold.otf",
      weight: "700",
    },
  ],
  variable: "--font-satoshi",
})
const inter = Public_Sans({ subsets: ["latin"] })
