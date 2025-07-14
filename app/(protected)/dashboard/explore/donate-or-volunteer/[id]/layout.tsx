import React, { Fragment, PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { ResolvingMetadata } from 'next'
import { getSingleCampaign } from '../../../../../../utils/api/campaigns/getCampaigns'

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  // read route params
  const id = params.id

  // fetch data
  const campaign: any = await getSingleCampaign(id)

  return {
    title: {
      absolute:
        (campaign?.campaignType.includes('fundraise')
          ? 'Donate to '
          : 'Volunteer to ') +
        campaign.title +
        ` organised by ${campaign?.user?.organizationName || campaign?.user?.fullName}`
    },
    description: campaign?.story,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://www.oncrowdr.com/explore/c/${id}`,
      siteName: 'Crowdr',
      title:
        (campaign?.campaignType.includes('fundraise')
          ? 'Donate to '
          : 'Volunteer to ') +
        campaign.title +
        ` organised by ${campaign?.user?.organizationName || campaign?.user?.fullName}`,
      description: campaign?.story,
      images: [
        {
          url: campaign?.campaignCoverImage?.url,
          alt: `${campaign?.user?.organizationName || campaign?.user?.fullName} image` 
        }
      ]
    },
    twitter: {
      title:
        (campaign?.campaignType.includes('fundraise')
          ? 'Donate to '
          : 'Volunteer to ') +
        campaign.title +
        ` organised by ${campaign?.user?.organizationName || campaign?.user?.fullName}`,
      card: 'summary_large_image',
      site: `@oncrowdr`,
      creator: '@oncrowdr',
      images: campaign?.campaignCoverImage?.url,
      description: campaign?.story
    }
  }
}

export default function Layout (props: any) {
  return <Fragment>{props.children}</Fragment>
}
