import React, { Fragment, PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crowdr Pricing | Transparent & Affordable Crowdfunding Fees",

  description:
    "See Crowdr’s pricing plans for crowdfunding campaigns. No hidden fees—just simple, transparent pricing to help you raise funds effectively.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.oncrowdr.com/",
    siteName: "Crowdr",
    title: "Crowdr Pricing | Transparent & Affordable Crowdfunding Fees",
    description:
      "See Crowdr’s pricing plans for crowdfunding campaigns. No hidden fees—just simple, transparent pricing to help you raise funds effectively.",
    images: [
      {
        url: "https://res.cloudinary.com/dqx8jfcj0/image/upload/v1713100843/crowdr_wordmark_png-GREEN_weutm8.png",
        alt: "Crowdr logo"
      }
    ]
  }
};

export default function Layout({ children }: PropsWithChildren) {
  return <Fragment>{children}</Fragment>;
}
