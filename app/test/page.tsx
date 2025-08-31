export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Test Page</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Rendering Test</h2>
          <p className="text-gray-600 mb-4">If you can see this page, basic rendering is working.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-semibold text-blue-800">Blue Box</h3>
              <p className="text-blue-600">This should be visible</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-semibold text-green-800">Green Box</h3>
              <p className="text-green-600">This should also be visible</p>
            </div>
          </div>
          <div className="mt-6">
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  )
}
