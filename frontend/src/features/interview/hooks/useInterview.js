import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {interviewReportGeneration, getReport, getAllReports, generateResumePdf} from '../services/interview.api'

export const useInterview = ()=>{
    const context = useContext(InterviewContext);

    if(!context){
        throw new Error("useInterview must be used within interviewProvider");
    }
    const {report, setReport, loading, setLoading, reports, setReports} = context;

    const generatingReport= async(resume, selfDescription, jobDescription)=>{
        setLoading(true);
        let response = "";
        try{
            response = await interviewReportGeneration({resume, selfDescription, jobDescription});
            setReport(response.interviewReport);
            
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        return response.interviewReport;
    }

    const gettingReport = async(interviewId)=>{
        setLoading(true);
        let response = "";
        try{
            response = await getReport(interviewId);
            setReport(response.interviewReport);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        return response;
    }

    const gettingAllReports = async()=>{
        setLoading(true);
        let response;
        try{
            response = await getAllReports();
            setReports(response.interviewReports);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        return response;
    }

    const generatingResume = async({interviewId})=>{
        setLoading(true);
        let response = "null";
        try{
            response = await generateResumePdf({interviewId});
            const url = window.URL.createObjectURL(new Blob([response],{type:"application/pdf"}));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewId}.pdf`);
            document.body.appendChild(link);
            link.click();
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {report, reports, loading, generatingReport, gettingReport, gettingAllReports, generatingResume}
}