import '../styles/home.style.scss'

const Home = () => {
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
                <input hidden type="file" id="resume" accept=".pdf" />
            </div>

            <div className="input-group">
              <label htmlFor="selfDescription">
                Self Description (Optional)
              </label>
              <textarea
                id="selfDescription"
                placeholder="Tell us about yourself, projects, skills..."
              />
            </div>
          </div>
        </div>

        <button className="button primary-button">
          Generate Interview Report
        </button>
      </div>
    </main>
  );
};

export default Home;