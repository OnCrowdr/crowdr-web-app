import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { headers } from 'next/headers'

import { IGetProfileResponseData } from '@/api/_profile/models/GetProfile'
import ProfileLayoutClient from './_components/ProfileLayoutClient'

interface ProfileLayoutProps {
  children: React.ReactNode
  params: { userId?: string }
}

async function fetchProfile(userId: string): Promise<IGetProfileResponseData> {
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const response = await fetch(`${baseUrl}/api/profile/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization headers if present
        'Cookie': headersList.get('cookie') || '',
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error('Failed to fetch profile')
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

export async function generateMetadata({ params }: ProfileLayoutProps): Promise<Metadata> {
  try {
    const userId = params.userId
    if (!userId) {
      return {
        title: 'Profile | Crowdr',
        description: 'User profile page',
      }
    }

    const profile = await fetchProfile(userId)
    const profileName = profile.user.userType === 'individual' 
      ? profile.user.fullName 
      : profile.user.organizationName

    return {
      title: `${profileName} | Crowdr`,
      description: profile.bio || `View ${profileName}'s profile and campaigns on Crowdr`,
      openGraph: {
        title: `${profileName} | Crowdr`,
        description: profile.bio || `View ${profileName}'s profile and campaigns on Crowdr`,
        images: profile.image?.url ? [profile.image.url] : [],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${profileName} | Crowdr`,
        description: profile.bio || `View ${profileName}'s profile and campaigns on Crowdr`,
        images: profile.image?.url ? [profile.image.url] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Profile | Crowdr',
      description: 'User profile page',
    }
  }
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  let profile: IGetProfileResponseData | null = null

  try {
    const userId = params.userId
    if (userId) {
      profile = await fetchProfile(userId)
    }
  } catch (error) {
    // Handle error gracefully - let client-side handle the error state
    console.error('Profile layout error:', error)
  }

  return (
    <Suspense fallback={
      <div className="animate-pulse max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-gray-100 mb-8">
              <div className="relative h-64 w-full bg-gray-200"></div>
              <div className="p-6">
                <div className="flex space-x-4">
                  <div className="size-16 h-16 w-16 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-6 py-1 max-w-[200px]">
                    <div className="space-y-3">
                      <div className="h-2 rounded bg-gray-200"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                        <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-2 rounded bg-gray-200 max-w-[100px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProfileLayoutClient 
        initialProfile={profile} 
        userId={params.userId}
      >
        {children}
      </ProfileLayoutClient>
    </Suspense>
  )
}