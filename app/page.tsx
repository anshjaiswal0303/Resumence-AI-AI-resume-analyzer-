import ResumeUpload from "@/components/ResumeUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#fff7ed]">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-60 -top-60 h-[500px] w-[500px] rounded-full bg-orange-600/[0.07] blur-[140px]" />

        <div className="absolute -right-60 top-[30%] h-[500px] w-[500px] rounded-full bg-rose-500/[0.05] blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-stone-800/80 bg-[#0c0a09]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">

            {/* Logo */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-lg font-black text-black">
              📜
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Resumence
                <span className="text-orange-500"> AI</span>
              </h1>

              <p className="text-xs text-stone-500">
                Resume Intelligence Platform
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-5 sm:flex">

            <div className="flex items-center gap-2 text-sm text-stone-400">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Built by Ansh Jaiswal
            </div>

            <span className="text-sm text-stone-500">
            </span>

          </div>

        </div>
      </header>

      {/* Main */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">

        <div className="grid items-start gap-16 lg:grid-cols-[1fr_0.9fr]">

          {/* Left */}
          <div className="pt-4">

            {/* Small label */}
            <div className="mb-7 flex items-center gap-3">

              <div className="h-px w-10 bg-orange-500" />

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                Resume Intelligence
              </span>

            </div>

            {/* Heading */}
            <h2 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">

              Your Resume.

              <br />

              <span className="text-orange-500">
                Your First Impression.
              </span>

            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-stone-400">
              Get a clear, AI-powered understanding of how your resume
              performs — from ATS compatibility to skills, strengths,
              weaknesses and actionable improvements.
            </p>

            {/* Feature list */}
            <div className="mt-10 space-y-4">

              <Feature
                number="01"
                title="ATS Compatibility"
                description="Understand how effectively your resume can pass automated screening."
              />

              <Feature
                number="02"
                title="Resume Intelligence"
                description="Get an AI-generated breakdown of your professional profile."
              />

              <Feature
                number="03"
                title="Actionable Improvements"
                description="Know exactly what you can improve before applying."
              />

            </div>

            {/* Bottom note */}
            <div className="mt-10 flex items-center gap-3 text-sm text-stone-500">
              <span className="text-orange-500">✓</span>
              Powered by Gemini AI
            </div>

          </div>

          {/* Right */}
          <div className="relative">

            {/* Small orange accent */}
            <div className="absolute -left-3 top-10 h-20 w-1 rounded-full bg-orange-500" />

            <div className="rounded-3xl border border-stone-800 bg-[#15110f] p-7 shadow-2xl sm:p-9">

              <ResumeUpload />

            </div>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section className="relative border-y border-stone-800 bg-[#110e0c]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">

          <Stat value="ATS" label="Compatibility" />
          <Stat value="AI" label="Analysis" />
          <Stat value="PDF" label="Supported" />
          <Stat value="100%" label="Actionable" />

        </div>

      </section>

      {/* Footer */}
      <footer className="relative px-6 py-10 text-center">

        <p className="text-sm text-stone-500">
          Built by{" "}
          <span className="font-semibold text-stone-300">
            Ansh Abhay Jaiswal
          </span>
        </p>

        <p className="mt-2 text-xs text-stone-600">
          Next.js · Tailwind CSS · Gemini AI
        </p>

      </footer>

    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex gap-5 border-b border-stone-800 pb-5">

      <span className="pt-1 text-xs font-bold text-orange-500">
        {number}
      </span>

      <div>
        <h3 className="font-semibold text-stone-100 transition group-hover:text-orange-400">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-stone-500">
          {description}
        </p>
      </div>

    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-r border-stone-800 px-5 py-7 text-center last:border-r-0">

      <p className="text-2xl font-black text-orange-500">
        {value}
      </p>

      <p className="mt-1 text-xs uppercase tracking-wider text-stone-600">
        {label}
      </p>

    </div>
  );
}