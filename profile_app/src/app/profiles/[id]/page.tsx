'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface PortfolioItem {
  id: string
  title: string
  description: string | null
  mediaUrl: string | null
  mediaType: string
  createdAt: string
}

interface Portfolio {
  id: string
  title: string
  description: string | null
  items: PortfolioItem[]
}

interface Profile {
  id: string
  name: string
  email: string
  profileImage: string | null
  bio: string | null
  createdAt: string
  portfolio: Portfolio | null
}

export default function ProfilePage() {
  const params = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [params.id])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profiles/${params.id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || 'Profile not found'}</p>
          <Link 
            href="/"
            className="mt-4 inline-block text-purple-400 hover:text-purple-300 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-black/90 rounded-xl shadow-2xl p-8 border border-gray-800">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={profile.name || 'Profile'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-purple-400">
                {profile.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {profile.name || 'Anonymous'}
            </h1>
            <p className="text-gray-400 mt-1">{profile.email}</p>
            {profile.bio && (
              <p className="text-gray-300 mt-4 max-w-2xl">{profile.bio}</p>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Portfolio Section */}
        {profile.portfolio && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-purple-400 mb-6">
              {profile.portfolio.title}
            </h2>
            {profile.portfolio.description && (
              <p className="text-gray-300 mb-8">{profile.portfolio.description}</p>
            )}

            {/* Portfolio Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.portfolio.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-purple-500/30 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-300 mb-4">{item.description}</p>
                  )}
                  {item.mediaUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                      {item.mediaType.startsWith('image/') ? (
                        <Image
                          src={item.mediaUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : item.mediaType.startsWith('video/') ? (
                        <video
                          src={item.mediaUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Media preview not available
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-gray-500 text-sm mt-4">
                    Added {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-md hover:from-purple-500 hover:to-pink-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 