"use client";

import { useState } from "react";
import AnalysisCard from "./AnalysisCard";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (selectedFile: File) => {
    setError("");

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setAnalysis("");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a PDF resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis("");

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
        setError(data.message || "Analysis failed.");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong while analyzing your resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setAnalysis("");
    setError("");
  };

  const getSection = (start: string, end?: string) => {
    if (!analysis.includes(start)) {
      return "Not Available";
    }

    const startIndex =
      analysis.indexOf(start) + start.length;

    const endIndex = end
      ? analysis.indexOf(end, startIndex)
      : analysis.length;

    return analysis
      .substring(
        startIndex,
        endIndex === -1 ? analysis.length : endIndex
      )
      .replace(/[:*#]/g, "")
      .trim();
  };

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-7">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
              Step 01
            </p>

            <h2 className="mt-2 text-2xl font-bold text-stone-100">
              Upload your resume
            </h2>
          </div>

          <div className="rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-500">
            PDF
          </div>

        </div>

        <p className="mt-3 text-sm leading-6 text-stone-500">
          We'll analyze your resume and identify areas that can
          improve your chances of getting shortlisted.
        </p>

      </div>

      {/* Upload */}
      <div className="rounded-2xl border border-dashed border-stone-700 bg-[#0f0c0a] p-8 text-center transition hover:border-orange-500/50">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500 text-2xl text-black">
          📜
        </div>

        <h3 className="mt-5 font-semibold text-stone-200">
          Drop your resume here
        </h3>

        <p className="mt-2 text-sm text-stone-600">
          or choose a PDF
        </p>

        <label
          htmlFor="resume-upload"
          className="mt-6 inline-flex cursor-pointer rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
        >
          Upload Resume
        </label>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="mt-4 text-xs text-stone-700">
          PDF · Maximum 10MB
        </p>

      </div>

      {/* Selected File */}
      {file && (
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-stone-800 bg-[#0f0c0a] p-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            ✓
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-stone-200">
              {fileName}
            </p>

            <p className="mt-1 text-xs text-stone-600">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>

          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className="text-xs text-stone-600 hover:text-orange-400"
          >
            Remove
          </button>

        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Analyze */}
      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="
          mt-6 w-full rounded-xl
          bg-orange-500
          px-6 py-4
          font-bold text-black
          transition
          hover:bg-orange-400
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            Analyzing Resume...
          </span>
        ) : (
          "Analyze Resume →"
        )}
      </button>

      {/* Loading */}
      {loading && (
        <div className="mt-5 border-l-2 border-orange-500 pl-4">
          <p className="text-sm text-stone-300">
            Analyzing your resume...
          </p>

          <p className="mt-1 text-xs text-stone-600">
            AI is reviewing your document.
          </p>
        </div>
      )}

      {/* Results */}
      {analysis && !loading && (
        <div className="mt-10">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                Step 02
              </p>

              <h2 className="mt-2 text-xl font-bold text-stone-100">
                Resume Analysis
              </h2>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-stone-600 hover:text-orange-400"
            >
              Analyze another
            </button>

          </div>

          <div className="space-y-5">

            <AnalysisCard
              title="ATS Score"
              content={getSection(
                "ATS Score",
                "Resume Summary"
              )}
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
              content={getSection("Suggestions")}
            />

          </div>

        </div>
      )}

    </div>
  );
}