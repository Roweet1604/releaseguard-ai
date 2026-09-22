import { useState } from "react";

function App() {
  const [requirement, setRequirement] = useState("");

  const analyzeRequirement = () => {
    console.log("Requirement:", requirement);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-mark">R</span>
          <span>ReleaseGuard AI</span>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </nav>

      <main className="main-content">
        <section className="hero">
          <div className="badge">
            AI-POWERED RELEASE INTELLIGENCE
          </div>

          <h1>
            Ship with
            <span> confidence.</span>
          </h1>

          <p className="hero-description">
            Turn software requirements into executable tests,
            analyze failures with AI, and understand your release
            risk before you ship.
          </p>
        </section>

        <section className="requirement-card">
          <div className="card-header">
            <div>
              <h2>Describe your requirement</h2>
              <p>
                Tell ReleaseGuard what behavior you want to verify.
              </p>
            </div>

            <span className="step-number">01</span>
          </div>

          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Example: Users should receive a 20% discount when applying a valid coupon at checkout."
          />

          <div className="card-footer">
            <span className="character-count">
              {requirement.length} characters
            </span>

            <button
              onClick={analyzeRequirement}
              disabled={!requirement.trim()}
            >
              Analyze Requirement
              <span>→</span>
            </button>
          </div>
        </section>

        <section className="workflow">
          <div className="workflow-item">
            <div className="workflow-number">01</div>
            <h3>Analyze</h3>
            <p>Understand requirements and risks.</p>
          </div>

          <div className="workflow-line"></div>

          <div className="workflow-item">
            <div className="workflow-number">02</div>
            <h3>Generate</h3>
            <p>Create executable Playwright tests.</p>
          </div>

          <div className="workflow-line"></div>

          <div className="workflow-item">
            <div className="workflow-number">03</div>
            <h3>Execute</h3>
            <p>Run tests in a real browser.</p>
          </div>

          <div className="workflow-line"></div>

          <div className="workflow-item">
            <div className="workflow-number">04</div>
            <h3>Decide</h3>
            <p>Understand release readiness.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;