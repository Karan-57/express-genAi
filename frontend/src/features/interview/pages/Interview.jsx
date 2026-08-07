import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import "../styles/Interview.scss";
import { InterviewContext } from "../interview.context";
import { useInterview } from "../hooks/useInterview.js";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const [expandedDay, setExpandedDay] = useState(null);

  const context = useContext(InterviewContext);
  const { report, loading } = context;

  const { interviewId } = useParams();
  const { gettingReport } = useInterview();

  useEffect(() => {
    if (interviewId) {
      gettingReport(interviewId);
    }
  }, [interviewId]);

  if (loading || !report) {
    return (
      <main>
        <p>loading...</p>
      </main>
    );
  }

  return (
    <main>
      <div className="interview-report">

        <aside className="sidebar">
          <h2>Interview Report</h2>

          <nav>
            <button
              className={activeTab === "technical" ? "active" : ""}
              onClick={() => setActiveTab("technical")}
            >
              Technical Questions
            </button>

            <button
              className={activeTab === "behavioral" ? "active" : ""}
              onClick={() => setActiveTab("behavioral")}
            >
              Behavioral Questions
            </button>

            <button
              className={activeTab === "roadmap" ? "active" : ""}
              onClick={() => setActiveTab("roadmap")}
            >
              Preparation Roadmap
            </button>
          </nav>
        </aside>

        <section className="content">

          {activeTab === "technical" && (
            <>
              <h1>Technical Questions</h1>

              {report.technicalQuestions.map((technicalQuestion, index) => {
                return (
                  <div className="question-card" key={index}>
                    <h3>{technicalQuestion.question}</h3>

                    <div className="intent">
                      <strong>Intent</strong>
                      <p>{technicalQuestion.intent}</p>
                    </div>

                    <div className="answer">
                      <strong>Ideal Answer</strong>
                      <p>{technicalQuestion.answer}</p>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === "behavioral" && (
            <>
              <h1>Behavioral Questions</h1>

              {report.behavioralQuestions.map((behavioralQuestion, index) => {
                return (
                  <div className="question-card" key={index}>
                    <h3>{behavioralQuestion.question}</h3>

                    <div className="intent">
                      <strong>Intent</strong>
                      <p>{behavioralQuestion.intent}</p>
                    </div>

                    <div className="answer">
                      <strong>Ideal Answer</strong>
                      <p>{behavioralQuestion.answer}</p>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === "roadmap" && (
            <>
              <h1>Preparation Roadmap</h1>

              <div className="roadmap">

                {report.preparationPlan.map((day) => {
                  const isExpanded = expandedDay === day.day;

                  return (
                    <div className="roadmap-item" key={day.day}>

                      <div className="roadmap-marker"></div>

                      <div className="question-card">

                        <div
                          className="roadmap-header"
                          onClick={() =>
                            setExpandedDay(
                              isExpanded ? null : day.day
                            )
                          }
                        >
                          <div>
                            <h3>{`Day ${day.day}`}</h3>
                            <p>{day.focus}</p>
                          </div>

                          <span
                            className={`roadmap-arrow ${
                              isExpanded ? "open" : ""
                            }`}
                          >
                            <i className="ri-arrow-down-s-line roadmap-arrow"></i>
                          </span>
                        </div>

                        {/* Always rendered so CSS can animate it */}
                        <div
                          className={`roadmap-tasks ${
                            isExpanded ? "open" : ""
                          }`}
                        >
                          {day.tasks.map((task, index) => (
                            <div className="task" key={index}>
                              <span>•</span>
                              <p>{task}</p>
                            </div>
                          ))}
                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            </>
          )}

        </section>

        <aside className="summary">

          <div className="score-card">
            <h3>Match Score</h3>

            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${report.matchScore}%` }}
              ></div>
            </div>

            <span>{report.matchScore} / 100</span>
          </div>

          <div className="skill-gap-card">
            <h3>Skill Gaps</h3>

            <div className="chips">
              {report.skillGaps.map((skill, index) => {
                return (
                  <span className="high" key={index}>
                    {skill.skill}
                  </span>
                );
              })}
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
};

export default Interview;