import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {interviewReportGeneration, getReport, getAllReports} from '../services/interview.api'

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

    const getingAllReports = async()=>{
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

    return {report, reports, loading, generatingReport, gettingReport, getingAllReports}
}