import React, { Fragment, PropsWithChildren } from 'react'
import type { Metadata } from 'next'
import { ResolvingMetadata } from 'next'
import { getSingleProfile } from '../../../../utils/api/profile/getProfile'

interface MetadataProps {
  params: Promise<{ userId: string }>
}

export async function generateMetadata(props: MetadataProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  // read route params
  const userId = params.userId

  try {
    // fetch data
    const profile: any = await getSingleProfile(userId, true) // noAuth=true for public profiles
    
    // If profile is null or undefined, return default metadata
    if (!profile) {
      console.error(`Profile with ID ${userId} not found for metadata generation`)
      return {
        title: 'Profile Not Found | Crowdr',
        description: 'The requested profile could not be found.',
        openGraph: {
          type: 'profile',
          locale: 'en_US',
          url: `https://www.oncrowdr.com/profile/${userId}`,
          siteName: 'Crowdr',
          title: 'Profile Not Found | Crowdr',
          description: 'The requested profile could not be found.'
        },
        twitter: {
          title: 'Profile Not Found | Crowdr',
          card: 'summary',
          site: '@oncrowdr',
          creator: '@oncrowdr',
          description: 'The requested profile could not be found.'
        }
      }
    }

    // Safely access nested properties using optional chaining
    const userType = profile?.user?.userType || 'individual'
    const organizationName = profile?.user?.organizationName || ''
    const fullName = profile?.user?.fullName || 'User'
    const bio = profile?.bio || ''
    const profileImageUrl = profile?.image?.url || ''
    const backgroundImageUrl = profile?.backgroundImage?.url || ''
    const location = profile?.location || ''
    
    const displayName = userType === 'individual' ? fullName : organizationName
    const profileTitle = `${displayName} | Crowdr Profile`
    
    // Create a comprehensive description
    const description = bio || 
      `View ${displayName}'s profile on Crowdr${location ? ` from ${location}` : ''}. ${userType === 'individual' ? 'Support their campaigns' : 'Learn more about this organization'} and make a difference together.`

    return {
      title: {
        absolute: profileTitle
      },
      description: description,
      openGraph: {
        type: 'profile',
        locale: 'en_US',
        url: `https://www.oncrowdr.com/profile/${userId}`,
        siteName: 'Crowdr',
        title: profileTitle,
        description: description,
        images: [
          {
            url: profileImageUrl || backgroundImageUrl || '',
            alt: `${displayName}'s profile image`,
            width: profileImageUrl ? 400 : 1200,
            height: profileImageUrl ? 400 : 630,
          }
        ]
      },
      twitter: {
        title: profileTitle,
        card: 'summary_large_image',
        site: `@oncrowdr`,
        creator: '@oncrowdr',
        images: profileImageUrl || backgroundImageUrl || '',
        description: description
      },
      alternates: {
        canonical: `https://www.oncrowdr.com/profile/${userId}`,
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for profile ${userId}:`, error)
    
    // Return fallback metadata in case of any error
    return {
      title: 'User Profile | Crowdr',
      description: 'Discover amazing people and organizations making a difference on Crowdr',
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `https://www.oncrowdr.com/profile/${userId}`,
        siteName: 'Crowdr',
        title: 'User Profile | Crowdr',
        description: 'Discover amazing people and organizations making a difference on Crowdr'
      },
      twitter: {
        title: 'User Profile | Crowdr',
        card: 'summary',
        site: '@oncrowdr',
        creator: '@oncrowdr',
        description: 'Discover amazing people and organizations making a difference on Crowdr'
      }
    }
  }
}

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}

export default function Layout(props: LayoutProps) {
  return <Fragment>{props.children}</Fragment>
}