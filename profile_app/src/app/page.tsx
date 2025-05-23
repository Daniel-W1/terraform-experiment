'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Profile {
  id: string
  name: string
  email: string
  profileImage: string | null
  bio: string | null
  portfolio: {
    title: string
    description: string | null
    items: Array<{
      title: string
      description: string | null
      mediaUrl: string | null
      mediaType: string
    }>
  } | null
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profiles?page=${pagination.page}&limit=${pagination.limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profiles')
      }

      setProfiles(data.profiles)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit]);
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Discover Amazing Profiles
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {profiles.map((profile) => (
          <Link
            href={`/profiles/${profile.id}`}
            key={profile.id}
            className="group"
          >
            <div className="bg-black/90 rounded-xl shadow-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={profile.name || 'Profile'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-purple-400">
                      {profile.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {profile.name || 'Anonymous'}
                  </h2>
                  <p className="text-gray-400 text-sm">{profile.email}</p>
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                  {profile.bio}
                </p>
              )}

              {profile.portfolio && (
                <div className="space-y-2">
                  <h3 className="text-purple-400 font-medium">
                    {profile.portfolio.title}
                  </h3>
                  {profile.portfolio.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {profile.portfolio.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-300">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
