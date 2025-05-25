'use client'

import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

export default function Header() {
  const { user, loading, logout } = useAuth()

  return (
    <header className="bg-black/90 border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            ProfileHub
          </Link>
          
          <div className="flex items-center gap-6">
            {loading ? (
              // Loading skeleton
              <div className="flex items-center gap-6">
                <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-800 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                <Link href="/profile" className="text-gray-300 hover:text-purple-400 transition-colors">
                  My Profile
                </Link>
                <Link href="/settings" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-purple-400 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-md hover:from-purple-500 hover:to-pink-600 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}