import { NextRequest, NextResponse } from "next/server";
import { getDocumentProxy, extractText } from "unpdf";
import ai from "@/lib/gemini";

/*
|--------------------------------------------------------------------------
| Gemini Configuration
|--------------------------------------------------------------------------
*/

const GEMINI_MODEL = "gemini-3.6-flash";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/*
|--------------------------------------------------------------------------
| Generate Gemini Response With Retry
|--------------------------------------------------------------------------
*/

async function generateWithRetry(prompt: string) {
  const maxRetries = 4;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(
        `Gemini request attempt ${attempt + 1}/${maxRetries}`
      );

      const result = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      console.log("Gemini analysis successful.");

      return result;

    } catch (error: any) {
      const status = error?.status;
      const message = error?.message || "";

      console.error(
        `Gemini error on attempt ${attempt + 1}:`,
        message
      );

      /*
      |--------------------------------------------------------------------------
      | Retry temporary errors
      |--------------------------------------------------------------------------
      |
      | 503 = Gemini temporarily unavailable
      | 429 = Rate limit / too many requests
      |
      */

      if (
        (status === 503 || status === 429) &&
        attempt < maxRetries - 1
      ) {
        const delay = 3000 * Math.pow(2, attempt);

        console.log(
          `Retrying Gemini in ${delay / 1000} seconds...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );

        continue;
      }

      /*
      |--------------------------------------------------------------------------
      | Do NOT retry permanent errors such as:
      |
      | 400
      | 401
      | 403
      | 404
      |
      */

      throw error;
    }
  }

  throw new Error(
    "Gemini AI is temporarily unavailable."
  );
}

/*
|--------------------------------------------------------------------------
| POST /api/analyze
|--------------------------------------------------------------------------
*/

export async function POST(req: NextRequest) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Get Form Data
    |--------------------------------------------------------------------------
    */

    const formData = await req.formData();

    const file = formData.get("resume");

    /*
    |--------------------------------------------------------------------------
    | Validate File
    |--------------------------------------------------------------------------
    */

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No resume uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate PDF
    |--------------------------------------------------------------------------
    */

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF resumes are supported.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate File Size
    |--------------------------------------------------------------------------
    */

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Resume file must be smaller than 10MB.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "The uploaded PDF is empty.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Convert PDF To Bytes
    |--------------------------------------------------------------------------
    */

    const bytes = new Uint8Array(
      await file.arrayBuffer()
    );

    /*
    |--------------------------------------------------------------------------
    | Load PDF
    |--------------------------------------------------------------------------
    */

    const pdf = await getDocumentProxy(bytes);

    /*
    |--------------------------------------------------------------------------
    | Extract Text
    |--------------------------------------------------------------------------
    */

    const { text } = await extractText(pdf, {
      mergePages: true,
    });

    /*
    |--------------------------------------------------------------------------
    | Check Extracted Text
    |--------------------------------------------------------------------------
    */

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Could not extract text from this PDF. Please upload a text-based PDF resume.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Limit Resume Text
    |--------------------------------------------------------------------------
    */

    const resumeText = text.substring(0, 50000);

    /*
    |--------------------------------------------------------------------------
    | Gemini Prompt
    |--------------------------------------------------------------------------
    */

    const prompt = `
You are an expert ATS Resume Analyzer and professional career coach.

Analyze the resume provided below.

Evaluate it from the perspective of:

1. Applicant Tracking Systems (ATS)
2. Recruiters
3. Technical hiring managers
4. Professional resume quality

Give practical, honest and actionable feedback.

IMPORTANT:

Return ONLY these sections in exactly this order:

ATS Score:
Resume Summary:
Technical Skills:
Strengths:
Weaknesses:
Suggestions:

Do not add any extra headings.

==================================================
ATS SCORE
==================================================

Give an ATS score from 0 to 100.

Format:

ATS Score:
78/100

Then briefly explain why.

Consider:

- ATS readability
- Resume structure
- Keywords
- Technical skills
- Job relevance
- Action verbs
- Quantifiable achievements
- Projects
- Experience
- Education
- Certifications
- Formatting

==================================================
RESUME SUMMARY
==================================================

Write a professional summary based ONLY on the resume.

Do not invent:

- Experience
- Education
- Companies
- Projects
- Skills
- Achievements

==================================================
TECHNICAL SKILLS
==================================================

Extract only technical skills that are actually mentioned.

Organize them into categories where possible:

Programming Languages:
Web Technologies:
Frameworks:
Databases:
Tools:
Cloud:
AI / Machine Learning:
Other:

==================================================
STRENGTHS
==================================================

Identify the strongest parts of the resume.

Consider:

- Technical skills
- Projects
- Experience
- Education
- Certifications
- Achievements
- Keywords
- Resume structure

Give specific observations.

==================================================
WEAKNESSES
==================================================

Identify things that may reduce the candidate's chances of getting shortlisted.

Consider:

- Missing keywords
- Weak descriptions
- Lack of measurable achievements
- Generic statements
- Weak project descriptions
- Formatting problems
- Missing links
- Grammar issues
- Missing relevant skills

Do not invent weaknesses.

==================================================
SUGGESTIONS
==================================================

Give specific actionable recommendations.

Prioritize the most important improvements first.

Examples:

- Rewrite project descriptions using action + technology + result.
- Add measurable achievements.
- Improve ATS keywords.
- Add GitHub links.
- Improve the professional summary.
- Add relevant technical skills.
- Improve project descriptions.

==================================================
RESUME
==================================================

${resumeText}
`;

    /*
    |--------------------------------------------------------------------------
    | Generate Analysis
    |--------------------------------------------------------------------------
    */

    const result = await generateWithRetry(prompt);

    /*
    |--------------------------------------------------------------------------
    | Get Gemini Text
    |--------------------------------------------------------------------------
    */

    const aiText = result?.text?.trim();

    if (!aiText) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gemini returned an empty analysis. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        success: true,
        message: aiText,
      },
      {
        status: 200,
      }
    );

  } catch (error: any) {
    /*
    |--------------------------------------------------------------------------
    | Error Logging
    |--------------------------------------------------------------------------
    */

    console.error(
      "Resume analysis error:",
      error
    );

    const status = error?.status;

    /*
    |--------------------------------------------------------------------------
    | 404 - Model Not Found
    |--------------------------------------------------------------------------
    */

    if (status === 404) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The selected Gemini model is unavailable. Please check your Gemini API configuration.",
        },
        {
          status: 500,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 503 - Temporary Gemini Problem
    |--------------------------------------------------------------------------
    */

    if (status === 503) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gemini AI is temporarily busy. Please wait a few seconds and try again.",
        },
        {
          status: 503,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 429 - Rate Limit
    |--------------------------------------------------------------------------
    */

    if (status === 429) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many AI requests right now. Please wait a moment and try again.",
        },
        {
          status: 429,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 401 / 403 - API Key Problem
    |--------------------------------------------------------------------------
    */

    if (
      status === 401 ||
      status === 403
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gemini API authentication failed. Please check your GEMINI_API_KEY.",
        },
        {
          status: 500,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Generic Error
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while analyzing your resume. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}