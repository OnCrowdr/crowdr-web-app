import React, { Fragment, PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { ResolvingMetadata } from 'next'
import { getSingleCampaign } from '../../../../../utils/api/campaigns/getCampaigns'

export async function generateMetadata(props: any, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  // read route params
  const id = params.campaignId

  try {
    // fetch data
    const campaign: any = await getSingleCampaign(id)
    
    // If campaign is null or undefined, return default metadata
    if (!campaign) {
      console.error(`Campaign with ID ${id} not found for metadata generation`)
      return {
        title: 'Campaign Not Found | Crowdr',
        description: 'The requested campaign could not be found.',
        openGraph: {
          type: 'website',
          locale: 'en_US',
          url: `https://www.oncrowdr.com`,
          siteName: 'Crowdr',
          title: 'Campaign Not Found | Crowdr',
          description: 'The requested campaign could not be found.'
        },
        twitter: {
          title: 'Campaign Not Found | Crowdr',
          card: 'summary',
          site: '@oncrowdr',
          creator: '@oncrowdr',
          description: 'The requested campaign could not be found.'
        }
      }
    }

    // Safely access nested properties using optional chaining
    const campaignType = campaign?.campaignType || ''
    const title = campaign?.title || 'Campaign'
    const story = campaign?.story || 'Support this campaign on Crowdr'
    const organizationName = campaign?.user?.organizationName || ''
    const fullName = campaign?.user?.fullName || 'Organizer'
    const coverImageUrl = campaign?.campaignCoverImage?.url || ''
    
    const displayName = organizationName || fullName
    const campaignTitle = 
      (campaignType.includes('fundraise') ? 'Donate to ' : 'Volunteer to ') + 
      title + 
      ` organised by ${displayName}`

    return {
      title: {
        absolute: campaignTitle
      },
      description: story,
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `https://www.oncrowdr.com/explore/c/${id}`,
        siteName: 'Crowdr',
        title: campaignTitle,
        description: story,
        images: [
          {
            url: coverImageUrl,
            alt: `${displayName} image` 
          }
        ]
      },
      twitter: {
        title: campaignTitle,
        card: 'summary_large_image',
        site: `@oncrowdr`,
        creator: '@oncrowdr',
        images: coverImageUrl,
        description: story
      }
    }
  } catch (error) {
    console.error(`Error generating metadata for campaign ${id}:`, error)
    
    // Return fallback metadata in case of any error
    return {
      title: 'Crowdr Campaign',
      description: 'Support campaigns on Crowdr',
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `https://www.oncrowdr.com`,
        siteName: 'Crowdr',
        title: 'Crowdr Campaign',
        description: 'Support campaigns on Crowdr'
      },
      twitter: {
        title: 'Crowdr Campaign',
        card: 'summary',
        site: '@oncrowdr',
        creator: '@oncrowdr',
        description: 'Support campaigns on Crowdr'
      }
    }
  }
}

export default function Layout(props: any) {
  return <Fragment>{props.children}</Fragment>
}