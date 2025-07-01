import { PropsWithChildren, useEffect } from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Public_Sans } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import "./common/styles/button.css"
import RootApp from "./app"
import { isProd } from "../config"
import GoogleAnalyticsComponents from "./_components/home/GoogleAnalyticsComponents"

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

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <GoogleAnalyticsComponents />
      {/* <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N95QRZ5K');
        `}
      </Script> */}
      {/* <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-JL3VDJ3QRX"
        async
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-JL3VDJ3QRX');
        `}
      </Script> */}

      {isProd && (
        <Script
          src="https://static.elfsight.com/platform/platform.js"
          strategy="afterInteractive"
          async
        />
      )}
      <body className={`${satoshi.variable} ${inter.className}`}>
        <RootApp>{children}</RootApp>
        {isProd && (
          <div
            className="elfsight-app-89621f74-d856-4133-9f3c-dcaedfbe0522"
            data-elfsight-app-lazy
          ></div>
        )}
        {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N95QRZ5K"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript> */}
      </body>
    </html>
  )
}
