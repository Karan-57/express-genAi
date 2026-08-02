import '../styles/home.style.scss'
import {useInterview} from '../hooks/useInterview'
import { useState,useRef } from 'react';
import {useNavigate} from 'react-router'

const Home = () => {
  const {loading, generationReport} = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setselfDescription] = useState("");
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleReportGeneration = async()=>{
    const resumeFile = resumeInputRef.current.files[0];
    const report = await generationReport({resumeFile, selfDescription, jobDescription});
    console.log(report)
    navigate(`/interview/${report._id}`)
  }

  if(loading){
    return(
      <main>
        <h1>loading</h1>
      </main>
    )
  }

  return (
    <main>
      <div className="interview-container">
            <div className="header">
            <h1>AI Interview Report Generator</h1>
            <p className="subtitle">
            Upload your resume and provide the job details to receive a complete interview report.
            </p>
        </div>

        <div className="interview-input-groups">
          <div className="left">
            <div className="input-group">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                onChange={(e)=>{
                  setJobDescription(e.target.value);
                }}
                id="jobDescription"
                placeholder="Paste the complete job description..."
              />
            </div>
          </div>

          <div className="right">
            <div className="input-group">
                <label htmlFor="resume" className="filebtn">
                    <i className="ri-file-fill"></i>
                    <span>Resume (PDF)</span>
                </label>
                <input ref={resumeInputRef} hidden type="file" id="resume" accept=".pdf" />
            </div>

            <div className="input-group">
              <label htmlFor="selfDescription">
                Self Description (Optional)
              </label>
              <textarea
                onChange={(e)=>{
                  setselfDescription(e.target.value);
                }}
                id="selfDescription"
                placeholder="Tell us about yourself, projects, skills..."
              />
            </div>
          </div>
        </div>

        <button 
          onClick={()=>{
            handleReportGeneration();
          }}
          className="button primary-button">
            Generate Interview Report
        </button>
      </div>
    </main>
  );
};

export default Home;