import ResumeUpload from "@/components/ResumeUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700">
            🤖 AI Resume Analyzer
          </h1>

          <span className="text-gray-500 text-sm">
            Powered by Gemini AI
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Side */}
          <div>

            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">
              AI Powered Resume Analysis
            </span>

            <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Improve Your Resume
              <br />
              <span className="text-blue-600">
                Beat the ATS with AI
              </span>
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-8">
              Upload your resume and receive an ATS score, resume summary,
              strengths, weaknesses, technical skills, and personalized
              suggestions powered by Google's Gemini AI.
            </p>

            <div className="grid grid-cols-2 gap-5 mt-10">

              <div className="bg-white rounded-2xl shadow-md p-5">
                <h3 className="font-bold text-blue-600">
                  📊 ATS Score
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Evaluate resume compatibility with ATS systems.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <h3 className="font-bold text-blue-600">
                  📝 Resume Summary
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Instant AI-generated professional summary.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <h3 className="font-bold text-blue-600">
                  💪 Strengths
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Identify your strongest resume sections.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-5">
                <h3 className="font-bold text-blue-600">
                  💡 Suggestions
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Improve your resume using AI recommendations.
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <ResumeUpload />
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        Built with ❤️ using Next.js, Tailwind CSS & Gemini AI
      </footer>

    </main>
  );
}