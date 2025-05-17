export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-black/90 rounded-xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-8">Settings</h1>

        <form className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Profile Information</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Full Stack Developer"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Contact Information</h2>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-md hover:from-purple-500 hover:to-pink-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}