import React, { Fragment, PropsWithChildren } from 'react'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "About Crowdr",

  description:
    "From fundraising to volunteer matching, Crowdr is the best way to crowdfund for individuals and NGOs in Nigeria.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.oncrowdr.com/",
    siteName: "Crowdr",
    title: "About Crowdr",
    description:
      "From fundraising to volunteer matching, Crowdr is the best way to crowdfund for individuals and NGOs in Nigeria.",
    images: [
      {
        url: "https://res.cloudinary.com/dqx8jfcj0/image/upload/v1713100843/crowdr_wordmark_png-GREEN_weutm8.png",
        alt: "Crowdr logo"
      }
    ]
  }
};


export default function Layout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      {children}
    </Fragment>
  )
}
