import { NextRequest, NextResponse } from "next/server";
import * as PdfParse from "pdf-parse-new";
import ai from "@/lib/gemini";

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

    const result = await PdfParse.default(buffer);

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
${result.text}
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