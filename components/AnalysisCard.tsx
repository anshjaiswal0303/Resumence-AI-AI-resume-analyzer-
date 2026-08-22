type AnalysisCardProps = {
  title: string;
  content: string;
};

const getIcon = (title: string) => {
  switch (title) {
    case "ATS Score":
      return "◉";
    case "Resume Summary":
      return "≡";
    case "Technical Skills":
      return "</>";
    case "Strengths":
      return "↗";
    case "Weaknesses":
      return "!";
    case "Suggestions":
      return "✦";
    default:
      return "•";
  }
};

const getAccent = (title: string) => {
  switch (title) {
    case "ATS Score":
      return "orange";

    case "Strengths":
      return "green";

    case "Weaknesses":
      return "red";

    case "Suggestions":
      return "yellow";

    case "Technical Skills":
      return "orange";

    default:
      return "orange";
  }
};

function getScore(content: string) {
  const match = content.match(/(\d{1,3})\s*\/\s*100/);

  if (!match) return null;

  return Math.min(100, Number(match[1]));
}

function getScoreStatus(score: number) {
  if (score >= 85) {
    return {
      label: "Excellent",
      description: "Your resume is highly ATS-friendly.",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      description:
        "Your resume has a solid ATS foundation with room for improvement.",
    };
  }

  if (score >= 55) {
    return {
      label: "Needs Improvement",
      description:
        "Several areas should be improved before applying.",
    };
  }

  return {
    label: "Needs Major Improvement",
    description:
      "Your resume needs significant optimization for ATS systems.",
  };
}

function formatContent(content: string) {
  return content
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function highlightNumbers(text: string) {
  const parts = text.split(
    /(\b\d+(?:\.\d+)?%?\b|\b\d+(?:,\d+)*\+?\b)/
  );

  return parts.map((part, index) => {
    if (
      /^\d/.test(part) &&
      (part.includes("%") ||
        part.includes("+") ||
        part.length >= 2)
    ) {
      return (
        <span
          key={index}
          className="font-semibold text-orange-400"
        >
          {part}
        </span>
      );
    }

    return part;
  });
}

function renderText(content: string) {
  const cleaned = formatContent(content);

  const lines = cleaned.split("\n");

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) return null;

        /*
         * Detect mini headings such as:
         *
         * Reasoning
         * Programming Languages:
         * Web Technologies:
         */

        const isHeading =
          trimmed.endsWith(":") &&
          trimmed.length < 45;

        if (isHeading) {
          return (
            <p
              key={index}
              className="pt-2 text-sm font-semibold text-stone-200"
            >
              {trimmed}
            </p>
          );
        }

        return (
          <div
            key={index}
            className="flex gap-3 text-[15px] leading-7 text-stone-400"
          >
            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />

            <p>
              {highlightNumbers(trimmed)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const progress =
    circumference - (score / 100) * circumference;

  return (
    <div className="relative h-32 w-32">

      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
      >
        {/* Background */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#292524"
          strokeWidth="9"
        />

        {/* Progress */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-stone-100">
          {score}
        </span>

        <span className="text-[10px] uppercase tracking-wider text-stone-600">
          / 100
        </span>
      </div>

    </div>
  );
}

export default function AnalysisCard({
  title,
  content,
}: AnalysisCardProps) {

  const accent = getAccent(title);

  const score =
    title === "ATS Score"
      ? getScore(content)
      : null;

  /*
  |--------------------------------------------------------------------------
  | ATS SCORE CARD
  |--------------------------------------------------------------------------
  */

  if (title === "ATS Score" && score !== null) {

    const status = getScoreStatus(score);

    return (
      <div className="overflow-hidden rounded-2xl border border-stone-800 bg-[#15110f]">

        {/* Top */}
        <div className="flex items-center gap-4 border-b border-stone-800 px-6 py-5">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-lg font-bold text-orange-500">
            ◉
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Resume Analysis
            </p>

            <h2 className="mt-1 text-xl font-bold text-stone-100">
              ATS Compatibility
            </h2>
          </div>

        </div>

        {/* Score */}
        <div className="grid items-center gap-8 px-6 py-7 sm:grid-cols-[auto_1fr]">

          <ScoreCircle score={score} />

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h3 className="text-2xl font-bold text-stone-100">
                {status.label}
              </h3>

              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                {score >= 70 ? "ATS Ready" : "Needs Work"}
              </span>

            </div>

            <p className="mt-3 max-w-md text-sm leading-6 text-stone-500">
              {status.description}
            </p>

            {/* Score bar */}
            <div className="mt-5">

              <div className="mb-2 flex justify-between text-xs">
                <span className="text-stone-600">
                  ATS Score
                </span>

                <span className="font-semibold text-orange-400">
                  {score}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-stone-800">

                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-700"
                  style={{
                    width: `${score}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* Reasoning */}
        <div className="border-t border-stone-800 px-6 py-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="h-5 w-1 rounded-full bg-orange-500" />

            <h3 className="font-bold text-stone-200">
              Why this score?
            </h3>

          </div>

          {renderText(
            content
              .replace(/^\s*\d{1,3}\s*\/\s*100\s*/i, "")
              .replace(/^Reasoning\s*/i, "")
          )}

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL ANALYSIS CARDS
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className={`rounded-2xl border bg-[#15110f] p-6 transition duration-300 hover:border-orange-500/30 ${
        accent === "green"
          ? "border-stone-800"
          : accent === "red"
          ? "border-stone-800"
          : accent === "yellow"
          ? "border-stone-800"
          : "border-stone-800"
      }`}
    >

      {/* Header */}
      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-lg font-bold text-orange-500">
          {getIcon(title)}
        </div>

        <div className="min-w-0">

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-500">
            Resume Analysis
          </p>

          <h2 className="mt-1 text-xl font-bold text-stone-100">
            {title}
          </h2>

        </div>

      </div>

      {/* Accent */}
      <div className="mt-5 h-px bg-stone-800">

        <div className="h-px w-10 bg-orange-500" />

      </div>

      {/* Content */}
      <div className="mt-6">
        {renderText(content)}
      </div>

    </div>
  );
}