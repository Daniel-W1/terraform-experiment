export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">John Doe</h1>
            <p className="text-gray-600">Full Stack Developer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">About Me</h2>
            <p className="text-gray-600">
              A passionate developer with experience in building modern web applications
              using Next.js, React, and TypeScript.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Contact</h2>
            <div className="space-y-2 text-gray-600">
              <p>Email: john.doe@example.com</p>
              <p>Location: San Francisco, CA</p>
              <p>GitHub: @johndoe</p>
            </div>
          </section>

          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-primary mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
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