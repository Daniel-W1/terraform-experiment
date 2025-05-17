import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            Profile App
          </Link>
          
          <div className="flex gap-6">
            <Link href="/profile" className="text-gray-600 hover:text-primary">
              Profile
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-primary">
              Settings
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
} 