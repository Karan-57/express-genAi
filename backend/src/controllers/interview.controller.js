const pdfParse = require('pdf-parse')

const generateInterviewReport = require('../services/ai.service') 
const interviewReportModel = require('../models/interviewReport.model')

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
        message:"report crated",
        interviewReportResponse
    });
} 

module.exports = {interviewReportGenerationController};