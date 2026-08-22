export default function Header() {
  return (
    <header className="relative z-10 mb-10">
      <div className="mx-auto max-w-4xl text-center">

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 shadow-[0_0_25px_rgba(139,92,246,0.12)]">

          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

          AI Powered Resume Analysis

        </div>

        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 text-3xl text-cyan-300 shadow-[0_0_35px_rgba(139,92,246,0.18)]">
          ✦
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">

          Resumence{" "}

          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            AI
          </span>

        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          Analyze your resume with AI and discover your ATS score,
          strengths, weaknesses, technical skills, and personalized
          improvement suggestions.
        </p>

        {/* Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

          <span className="rounded-full border border-purple-400/20 bg-purple-500/[0.04] px-4 py-2 text-xs text-purple-300">
            ✦ Gemini AI
          </span>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/[0.04] px-4 py-2 text-xs text-cyan-300">
            ◈ ATS Analysis
          </span>

          <span className="rounded-full border border-violet-400/20 bg-violet-500/[0.04] px-4 py-2 text-xs text-violet-300">
            ⚡ Instant Feedback
          </span>

        </div>

      </div>
    </header>
  );
}