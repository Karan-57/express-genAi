const {GoogleGenAI} = require('@google/genai') ;
const puppeteer = require('puppeteer');
const z = require("zod");
const { zodToJsonSchema} = require('zod-to-json-schema')

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});


async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
  const interviewReportJsonSchema = {
    type: "object",
    properties: {
      title:{
        type:"string",
        description:"title of a job for which report is generated"
      },
      matchScore: {
          type: "integer",
          minimum: 0,
          maximum: 100,
          description:"Resume match percentage between 0 and 100."
      },
      technicalQuestions: {
        type: "array",
        description: "List of technical interview questions with intent and ideal answers.",
        items: {
          type: "object",
          properties: {
            question: { type: "string", description: "Technical interview question relevant to the job description." },
            intent: { type: "string", description: "What skill or knowledge this technical question is designed to evaluate." },
            answer: { type: "string", description: "A strong sample answer or key points expected from the candidate." }
          },
          required: ["question", "intent", "answer"]
        }
      },
      behavioralQuestions: {
        type: "array",
        description: "List of behavioral interview questions with intent and ideal answers.",
        items: {
          type: "object",
          properties: {
            question: { type: "string", description: "Behavioral interview question relevant to the candidate." },
            intent: { type: "string", description: "What personality trait or soft skill this question assesses." },
            answer: { type: "string", description: "A model STAR-style answer or expected response." }
          },
          required: ["question", "intent", "answer"]
        }
      },
      skillGaps: {
        type: "array",
        description: "Identified skill gaps between the candidate profile and the job requirements.",
        items: {
          type: "object",
          properties: {
            skill: { type: "string", description: "A skill the candidate should improve to better match the job." },
            severity: { type: "string", enum: ["low", "medium", "high"], description: "Importance of improving this skill." }
          },
          required: ["skill", "severity"]
        }
      },
      preparationPlan: {
        type: "array",
        description: "Multi-day interview preparation plan tailored to the candidate.",
        items: {
          type: "object",
          properties: {
            day: { type: "integer", description: "Day number in the preparation schedule." },
            focus: { type: "string", description: "Primary topic or objective for the day." },
            tasks: {
              type: "array",
              items: { type: "string" },
              description: "List of tasks for the day."
            }
          },
          required: ["day", "focus", "tasks"]
        }
      }
    },
    required: ["title","matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
  };
  
  const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema);
    const prompt = `
      You are an expert Technical Recruiter and Senior Software Engineer.

      Your task is to analyze the candidate against the provided job description and generate an interview report.

      Context

      Job Description:
      ${jobDescription}

      Resume:
      ${resume || "Not provided"}

      Self Description:
      ${selfDescription || "Not provided"}

      Instructions:

      1. Calculate an accurate matchScore between 0 and 100.

      2. Generate 8-10 technical interview questions.
        - Questions must be directly related to the job description.
        - intent should explain what skill is being evaluated.
        - answer should be a concise ideal answer.

      3. Generate 5-6 behavioral interview questions.
        - Questions should evaluate communication, teamwork, ownership and problem solving.
        - intent should explain what skill is being evaluated.
        - answer should be a concise ideal answer.

      4. Identify ONLY the missing skills.

      IMPORTANT:
      For skillGaps:
      - skill must ONLY contain the skill name.
      - Never write explanations.
      - Never write sentences.
      - Maximum 3 words.

      Correct:
      Docker
      Redis
      CI/CD
      System Design
      AWS
      Kubernetes

      Incorrect:
      "The candidate should improve Docker knowledge."
      "Needs more experience with Redis."

      5. Create a preparation plan for 5 days.

      Each day should contain:
      - one focus topic
      - 3-5 practical tasks

      Return ONLY valid JSON matching the provided schema.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            responseJsonSchema: interviewReportJsonSchema
        },
    });

    const rawData = JSON.parse(response.text);
    const validatedData = interviewReportSchema.parse(rawData);
    return validatedData;
}

async function convertToPdf(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm"
      }
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({resume, jobDescription, selfDescription}){
  const resumeJsonSchema = {
    type: "object",
    properties: {
      html: {
        type: "string",
        description:
          "Recreated professional resume in valid HTML, generated by analyzing the provided resume, job description, and self description. The resume must be tailored specifically to the target job description while preserving the candidate's genuine skills, experience, education, and other information. Do not invent qualifications, experience, or achievements."
      }
    },
    required: ["html"]
  };

  // const resumeSchema = z.fromJSONSchema(resumeJsonSchema);

  const prompt = `
  You are an expert resume writer and technical recruiter.

  Your task is to recreate and optimize the candidate's existing resume for the target job description.

  You are given three inputs:

  1. Existing Resume:
  ${resume}

  2. Job Description:
  ${jobDescription}

  3. Self Description:
  ${selfDescription || "Not provided"}

  Instructions:

  - Analyze the existing resume carefully.
  - Analyze the job description and identify the skills, technologies, responsibilities, and keywords relevant to the target role.
  - Use the self description as additional context about the candidate.
  - Recreate the resume in valid HTML.
  - Tailor the resume specifically toward the provided job description.
  - Prioritize relevant skills, technologies, projects, and experience that already exist in the candidate's information.
  - Improve wording and presentation to make relevant experience stronger and more aligned with the job.
  - Naturally incorporate relevant keywords from the job description where they accurately represent the candidate's existing knowledge or experience.
  - Do not invent skills, technologies, work experience, projects, education, certifications, achievements, or qualifications that are not supported by the provided information.
  - Do not falsely claim that the candidate has experience with a technology simply because it appears in the job description.
  - Preserve factual information from the original resume.
  - Remove or reduce emphasis on information that is irrelevant to the target job when appropriate.
  - Make the final resume professional, concise, ATS-friendly, and targeted to the job.
  - The output must contain only the recreated resume as HTML through the required JSON schema.
  - Generate a complete HTML document beginning with <!DOCTYPE html>.
  - Include all necessary styling inside the HTML itself.
  - Do not use external CSS, JavaScript, images, fonts, or resources.
  - The HTML must be directly renderable by a headless browser for PDF generation.
  `;

  const response = await ai.models.generateContent({
    model:"gemini-3.1-flash-lite",
    contents:prompt,
    config:{
      responseMimeType: "application/json",
      responseJsonSchema:resumeJsonSchema
    }
  });

  const jsonContent = JSON.parse(response.text);//
  const pdfBuffer = await convertToPdf(jsonContent.html);

  return pdfBuffer;
}

module.exports = {generateInterviewReport, generateResumePdf};