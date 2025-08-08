"use client"
import { createContext, useContext, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useQueryClient } from 'react-query'
import { useAuth } from '@/contexts/AppProvider'
import { IGetProfileResponseData } from '@/api/_profile/models/GetProfile'
import query from '@/api/query'
import _profile from '@/api/_profile'

interface ProfileContextValue {
  profile: IGetProfileResponseData | undefined
  isLoading: boolean
  error: any
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileLayoutClient')
  }
  return context
}

interface ProfileLayoutClientProps {
  children: React.ReactNode
  initialProfile: IGetProfileResponseData | null
  userId?: string
}

export default function ProfileLayoutClient({ 
  children, 
  initialProfile, 
  userId: paramUserId 
}: ProfileLayoutClientProps) {
  const { user } = useAuth()
  const { userId: routeUserId } = useParams() as { userId?: string }
  const queryClient = useQueryClient()
  
  // Determine the actual userId to use
  const userId = paramUserId || routeUserId || user?._id || ""

  // Set up the query with initial data if available
  const profileQuery = useQuery({
    queryKey: [query.keys.PROFILE, userId],
    queryFn: () => _profile.getProfile({ userId }),
    enabled: !!userId,
    // Use initialData if we have SSR data
    initialData: initialProfile || undefined,
    // Don't refetch immediately if we have initial data
    refetchOnMount: !initialProfile,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Pre-populate the query cache with initial data on mount
  useEffect(() => {
    if (initialProfile && userId) {
      queryClient.setQueryData([query.keys.PROFILE, userId], initialProfile)
    }
  }, [initialProfile, userId, queryClient])

  const contextValue: ProfileContextValue = {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
  }

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  )
}