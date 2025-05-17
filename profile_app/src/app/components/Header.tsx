import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black/90 border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Profile App
          </Link>
          
          <div className="flex gap-6">
            <Link href="/profile" className="text-gray-300 hover:text-purple-400 transition-colors">
              Profile
            </Link>
            <Link href="/settings" className="text-gray-300 hover:text-purple-400 transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}