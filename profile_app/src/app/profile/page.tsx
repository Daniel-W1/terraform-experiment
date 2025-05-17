export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-black/90 rounded-xl shadow-2xl p-8 border border-gray-800">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full ring-2 ring-purple-500/50"></div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">John Doe</h1>
            <p className="text-gray-400">Full Stack Developer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">About Me</h2>
            <p className="text-gray-300">
              A passionate developer with experience in building modern web applications
              using Next.js, React, and TypeScript.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Contact</h2>
            <div className="space-y-2 text-gray-300">
              <p>Email: john.doe@example.com</p>
              <p>Location: San Francisco, CA</p>
              <p>GitHub: @johndoe</p>
            </div>
          </section>

          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm border border-purple-500/30 hover:border-purple-500/50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}