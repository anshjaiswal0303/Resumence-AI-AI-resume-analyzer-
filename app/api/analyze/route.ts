import { NextRequest, NextResponse } from "next/server";
import ai from "@/lib/gemini";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Load PDF
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
    }).promise;

    let text = "";

    // Extract text from every page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");

      text += pageText + "\n";
    }

    // Gemini Analysis
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `
You are an ATS Resume Analyzer.

Analyze this resume and provide:

1. ATS Score (out of 100)
2. Resume Summary
3. Technical Skills
4. Strengths
5. Weaknesses
6. Suggestions for Improvement

Resume:
${text}
      `,
    });

    return NextResponse.json({
      success: true,
      message: response.text,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}