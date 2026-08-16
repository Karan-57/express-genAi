import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:3000/api/interview",
    withCredentials:true
});

export const interviewReportGeneration = async ({resume,selfDescription, jobDescription})=>{
    const formData = new FormData();
    formData.append('resume',resume);
    formData.append('jobDescription',jobDescription);
    formData.append('selfDescription',selfDescription);

    const response = await api.post('/generate-report',formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    });

    return response.data;
}

export const getReport = async (interviewId)=>{
    const response = await api.get(`/get-report/${interviewId}`);

    return response.data;
}

export const getAllReports = async ()=>{
    const response = await api.get('get-all');

    return response.data;
}

export const generateResumePdf = async({interviewId})=>{
    const response = await api.get(`generate-resume/${interviewId}`,{
        responseType:"blob"
    });

    return response.data;
}