import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {interviewReportGeneration, getReport, getAllReports} from '../services/interview.api'

export const useInterview = ()=>{
    const context = useContext(InterviewContext);

    if(!context){
        throw new Error("useInterview must be used within interviewProvider");
    }
    const [report, setReport, loading, setLoading, reports, setReports] = context;

    const generateReport = async({resume, selfDescription, jobDescription})=>{
        setLoading(true);
        try{
            const response = await interviewReportGeneration({resume, selfDescription, jobDescription});
            setReport(response.interviewReport);
            
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const getReport = async(interviewId)=>{
        setLoading(true);
        try{
            const response = await getReport(interviewId);
            setReport(response.interviewReport);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const getAllReports = async()=>{
        setLoading(true);
        try{
            const response = await getAllReports();
            setReports(response.interviewReports);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return {report, reports, loading, generateReport, getReport, getAllReports}
}