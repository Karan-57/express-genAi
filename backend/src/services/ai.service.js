const {GoogleGenAI} = require('@google/genai') 
const z = require("zod");
const { zodToJsonSchema} = require('zod-to-json-schema')

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

const interviewReportJsonSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "integer",
      description: "Overall resume-to-job match score as a percentage between 0 and 100."
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
  required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema);

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
    const prompt = `You are a Technical Recruiter and Senior Software Engineer.
      Analyze how well the candidate matches the job description based strictly on the provided context data.

      Context:
      - Job Description: ${jobDescription}
      - Resume: ${resume || "Not provided"}
      - Self Description: ${selfDescription || "Not provided"}

    Evaluate objectively, match fields accurately, and fill out the response according to the requested data schema structure.`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            responseJsonSchema: interviewReportJsonSchema
        },
    });

    const validatedData = JSON.parse(response.text);
    return validatedData;
}

module.exports = generateInterviewReport;