'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleShare = async () => {
    if (!user) return

    const profileUrl = `${window.location.origin}/profiles/${user.id}`

    try {
      await navigator.clipboard.writeText(profileUrl)
      setShareStatus('copied')
      setTimeout(() => setShareStatus('idle'), 2000)
    } catch (error) {
      setShareStatus('error')
      setTimeout(() => setShareStatus('idle'), 2000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-black/90 rounded-xl shadow-2xl p-8 border border-gray-800">
          <div className="animate-pulse">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gray-800 rounded-full"></div>
              <div className="space-y-3">
                <div className="h-8 w-48 bg-gray-800 rounded"></div>
                <div className="h-4 w-32 bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-black/90 rounded-xl shadow-2xl p-8 border border-gray-800 relative">
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors flex items-center gap-2"
        >
          {shareStatus === 'copied' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : shareStatus === 'error' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Error
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share Profile
            </>
          )}
        </button>

        <div className="flex items-center gap-6 mb-8">
          {user.profileImage ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-purple-500/50">
              <Image
                src={user.profileImage}
                alt={user.name || 'Profile'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full ring-2 ring-purple-500/50 flex items-center justify-center text-3xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {user.name}
            </h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">About</h2>
            <div className="space-y-4 text-gray-300">
              {user.bio ? (
                <p>{user.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio added yet</p>
              )}
              <div className="pt-4 border-t border-gray-800">
                <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Account Status</h2>
            <div className="space-y-2 text-gray-300">
              <p>Email Verification: {user.isVerified ? 'Verified' : 'Not Verified'}</p>
              <p>Account ID: {user.id}</p>
            </div>
          </section>

          {user.portfolio && (
            <section className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-purple-400 mb-4">Portfolio</h2>
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-gray-200 mb-2">{user.portfolio.title}</h3>
                {user.portfolio.description && (
                  <p className="text-gray-400 mb-4">{user.portfolio.description}</p>
                )}
                {user.portfolio.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.portfolio.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                      >
                        {item.mediaType === 'IMAGE' && (
                          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                            <Image
                              src={item.mediaUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h4 className="text-lg font-semibold text-gray-200">{item.title}</h4>
                        {item.description && (
                          <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No portfolio items yet</p>
                )}
              </div>
            </section>
          )}

          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {!user.isVerified && (
                <button
                  onClick={() => router.push('/auth/verify-email')}
                  className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-md hover:bg-purple-500/30 transition-colors"
                >
                  Verify Email
                </button>
              )}
              <button
                onClick={() => router.push('/settings')}
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}