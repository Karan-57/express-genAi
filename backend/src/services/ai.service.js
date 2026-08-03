const {GoogleGenAI} = require('@google/genai') 
const z = require("zod");
const { zodToJsonSchema} = require('zod-to-json-schema')

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

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

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
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

module.exports = generateInterviewReport;