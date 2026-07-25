import { useState } from "react";
import "../styles/Interview.scss";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("technical");

  return (
    <main className="interview-page">
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

              <div className="question-card">
                <h3>Explain the Event Loop in Node.js.</h3>

                <div className="intent">
                  <strong>Intent</strong>
                  <p>
                    Evaluates understanding of asynchronous JavaScript and
                    Node.js runtime.
                  </p>
                </div>

                <div className="answer">
                  <strong>Ideal Answer</strong>
                  <p>
                    The Event Loop allows Node.js to perform non-blocking I/O by
                    processing callbacks through different phases...
                  </p>
                </div>
              </div>

              <div className="question-card">
                <h3>Difference between Authentication and Authorization?</h3>

                <div className="intent">
                  <strong>Intent</strong>
                  <p>Tests backend security fundamentals.</p>
                </div>

                <div className="answer">
                  <strong>Ideal Answer</strong>
                  <p>
                    Authentication verifies identity while Authorization
                    determines permissions after authentication.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "behavioral" && (
            <>
              <h1>Behavioral Questions</h1>

              <div className="question-card">
                <h3>Tell me about a difficult bug you solved.</h3>

                <div className="intent">
                  <strong>Intent</strong>
                  <p>
                    Evaluates problem solving, debugging ability and
                    communication skills.
                  </p>
                </div>

                <div className="answer">
                  <strong>Ideal Answer</strong>
                  <p>
                    Use the STAR method. Explain the problem, your approach,
                    tools used, outcome and what you learned.
                  </p>
                </div>
              </div>

              <div className="question-card">
                <h3>Describe a disagreement you had with a teammate.</h3>

                <div className="intent">
                  <strong>Intent</strong>
                  <p>
                    Measures teamwork, communication and conflict resolution.
                  </p>
                </div>

                <div className="answer">
                  <strong>Ideal Answer</strong>
                  <p>
                    Focus on listening, collaborating and reaching a mutually
                    beneficial solution.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "roadmap" && (
            <>
              <h1>Preparation Roadmap</h1>

              <div className="roadmap">

                <div className="roadmap-item">
                  <div className="roadmap-marker"></div>

                  <div className="question-card">
                    <h3>Day 1</h3>
                    <p>Revise JavaScript fundamentals, closures, promises and async/await.</p>
                  </div>
                </div>

                <div className="roadmap-item">
                  <div className="roadmap-marker"></div>

                  <div className="question-card">
                    <h3>Day 2</h3>
                    <p>Practice Express.js routing, middleware, authentication and JWT.</p>
                  </div>
                </div>

                <div className="roadmap-item">
                  <div className="roadmap-marker"></div>

                  <div className="question-card">
                    <h3>Day 3</h3>
                    <p>Revise MongoDB, aggregation pipeline, indexes and optimization.</p>
                  </div>
                </div>

                <div className="roadmap-item">
                  <div className="roadmap-marker"></div>

                  <div className="question-card">
                    <h3>Day 4</h3>
                    <p>Learn Docker basics, Redis caching and deployment concepts.</p>
                  </div>
                </div>

                <div className="roadmap-item">
                  <div className="roadmap-marker"></div>

                  <div className="question-card">
                    <h3>Day 5</h3>
                    <p>Give a mock interview and revise behavioral questions.</p>
                  </div>
                </div>

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
                style={{ width: "78%" }}
              ></div>
            </div>

            <span>78 / 100</span>
          </div>

          <div className="skill-gap-card">
            <h3>Skill Gaps</h3>

            <div className="chips">
              <span className="high">Docker</span>
              <span className="medium">Redis</span>
              <span className="medium">AWS</span>
              <span className="low">CI/CD</span>
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
};

export default Interview;