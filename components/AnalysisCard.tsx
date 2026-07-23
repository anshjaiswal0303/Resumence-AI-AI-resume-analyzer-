type AnalysisCardProps = {
  title: string;
  content: string;
};

const getIcon = (title: string) => {
  switch (title) {
    case "ATS Score":
      return "📊";
    case "Resume Summary":
      return "📝";
    case "Technical Skills":
      return "💻";
    case "Strengths":
      return "💪";
    case "Weaknesses":
      return "⚠️";
    case "Suggestions":
      return "💡";
    default:
      return "🤖";
  }
};

export default function AnalysisCard({
  title,
  content,
}: AnalysisCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 p-6">

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
          {getIcon(title)}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {title}
          </h2>
          <div className="w-12 h-1 bg-blue-500 rounded-full mt-1"></div>
        </div>
      </div>

      <div className="text-gray-700 leading-7 whitespace-pre-line text-[15px]">
        {content}
      </div>

    </div>
  );
}