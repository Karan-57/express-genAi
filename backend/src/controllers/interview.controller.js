const pdfParse = require('pdf-parse')

const generateInterviewReport = require('../services/ai.service') 
const interviewReportModel = require('../models/interviewReport.model')

/**
 * @description Controller to take resume,job description and self description as input, provide it to llm and generate a report which is saved into database
 */
async function interviewReportGenerationController(req,res){
    const parser = new pdfParse.PDFParse(new Uint8Array(req.file.buffer));
    const resumeContent = (await parser.getText()).text;
    const {selfDescription, jobDescription} = req.body;

    console.log(selfDescription, jobDescription)

    const interviewReportResponse = await generateInterviewReport(jobDescription, resumeContent, selfDescription);

    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resumeText:resumeContent,
        jobDescription,
        selfDescription,
        ...interviewReportResponse
    });

    res.status(201).json({
        message:"report created",
        interviewReport
    });
} 

/**
 * @description get a specific report based on interview id in params
 */
async function getReportController(req,res){
    const interviewId = req.params.interviewId;

    const interviewReport = await interviewReportModel.findById(interviewId);

    if(!interviewId){
        return res.status(404).json({
            message:"interview report not found"}
        );
    }

    res.status(200).json({
        message:"report fetched successfully",
        interviewReport
    });
}
/**
 * @description get title of all user generated reports
 */
async function getAllReportsController(req, res){
    const user = req.user;

    const interviewReports = await interviewReportModel.find({user:user.id}).sort({createdAt:-1}).select("-jobDescription -selfDescription -resumeText -matchScore -technicalQuestions -behaviouralQuestions -preparationPlan -skillGaps");

    res.status(200).json({
        message:"interview reports generated successfully",
        interviewReports
    });
}

module.exports = {interviewReportGenerationController, getReportController, getAllReportsController};