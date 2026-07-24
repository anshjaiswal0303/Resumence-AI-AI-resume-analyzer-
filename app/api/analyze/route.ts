import { NextRequest, NextResponse } from "next/server";
import { getDocumentProxy, extractText } from "unpdf";
import ai from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No resume uploaded.",
        },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    // Load PDF
    const pdf = await getDocumentProxy(bytes);

    // Extract all text
    const { text } = await extractText(pdf, {
      mergePages: true,
    });

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume and return the result in this exact format.

ATS Score:
Resume Summary:
Technical Skills:
Strengths:
Weaknesses:
Suggestions for Improvement:

Resume:

${text}
`;

    const result = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      message: result.text,
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