"use client";

import { useState } from "react";
import AnalysisCard from "./AnalysisCard";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select a PDF resume first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setAnalysis(data.message);
      } else {
        setAnalysis(data.message || "Analysis failed.");
      }
    } catch (error) {
      console.error(error);
      setAnalysis("Something went wrong.");
    }

    setLoading(false);
  };

  const getSection = (start: string, end?: string) => {
    if (!analysis.includes(start)) return "Not Available";

    const startIndex = analysis.indexOf(start) + start.length;

    const endIndex = end
      ? analysis.indexOf(end)
      : analysis.length;

    return analysis
      .substring(startIndex, endIndex)
      .replace(/[:*#-]/g, "")
      .trim();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-3xl font-bold text-center text-gray-800">
        Upload Your Resume
      </h2>

      <p className="text-center text-gray-500 mt-2 mb-6">
        Upload your PDF resume and get instant AI-powered feedback.
      </p>

      <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center bg-blue-50">

        <div className="text-5xl mb-4">📄</div>

        <p className="text-gray-600 mb-5">
          Select your resume (PDF only)
        </p>

        <label
          htmlFor="resume-upload"
          className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Browse Resume
        </label>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {fileName && (
          <p className="mt-4 text-green-600 font-semibold">
            ✅ {fileName}
          </p>
        )}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {analysis && (
        <div className="mt-10 space-y-6">

          <AnalysisCard
            title="ATS Score"
            content={getSection("ATS Score", "Resume Summary")}
          />

          <AnalysisCard
            title="Resume Summary"
            content={getSection("Resume Summary", "Technical Skills")}
          />

          <AnalysisCard
            title="Technical Skills"
            content={getSection("Technical Skills", "Strengths")}
          />

          <AnalysisCard
            title="Strengths"
            content={getSection("Strengths", "Weaknesses")}
          />

          <AnalysisCard
            title="Weaknesses"
            content={getSection("Weaknesses", "Suggestions")}
          />

          <AnalysisCard
            title="Suggestions"
            content={getSection("Suggestions")}
          />

        </div>
      )}
    </div>
  );
}