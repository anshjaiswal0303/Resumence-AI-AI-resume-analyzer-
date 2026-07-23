"use client";

import { useState } from "react";
import AnalysisCard from "./AnalysisCard";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");

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
  };

  const getSection = (
    start: string,
    end?: string
  ) => {
    if (!analysis.includes(start)) return "Not Available";

    const startIndex =
      analysis.indexOf(start) + start.length;

    const endIndex = end
      ? analysis.indexOf(end)
      : analysis.length;

    return analysis
      .substring(startIndex, endIndex)
      .replace(/[:*#-]/g, "")
      .trim();
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8">

      <h2 className="text-2xl font-bold text-center mb-6">
        Upload Your Resume
      </h2>

      <div className="text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />

        {fileName && (
          <p className="mt-3 text-green-600">
            Selected File: {fileName}
          </p>
        )}

        <button
          onClick={handleAnalyze}
          className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Analyze Resume
        </button>
      </div>

      {analysis && (
        <div className="mt-8 space-y-6">

          <AnalysisCard
            title="AI Resume Analysis"
            content={analysis}
          />

          <AnalysisCard
            title="Resume Summary"
            content={getSection(
              "Resume Summary",
              "Technical Skills"
            )}
          />

          <AnalysisCard
            title="Technical Skills"
            content={getSection(
              "Technical Skills",
              "Strengths"
            )}
          />

          <AnalysisCard
            title="Strengths"
            content={getSection(
              "Strengths",
              "Weaknesses"
            )}
          />

          <AnalysisCard
            title="Weaknesses"
            content={getSection(
              "Weaknesses",
              "Suggestions"
            )}
          />

          <AnalysisCard
            title="Suggestions"
            content={getSection(
              "Suggestions"
            )}
          />

          <AnalysisCard
            title="ATS Score"
            content={getSection(
              "ATS Score",
              "Resume Summary"
            )}
          />

        </div>
      )}
    </div>
  );
}