import { useEffect, useState } from "react";

function App() {
  const [requirement, setRequirement] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedTests, setGeneratedTests] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [runningTests, setRunningTests] = useState(false);
  const [testPlan, setTestPlan] = useState(null);
  const [creatingPlan, setCreatingPlan] = useState(false);
  

  const analyzeRequirement = async () => {
  if (!requirement.trim()) return;

  setLoading(true);
  setError("");
  setAnalysis(null);

  try {
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requirement,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Analysis failed");
    }

    setAnalysis(data.analysis);
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
const createTestPlan = async () => {
  console.log("CREATE TEST PLAN CLICKED");

  if (!analysis) {
    console.log("NO ANALYSIS FOUND");
    setError("Please analyze the requirement first.");
    return;
  }

  console.log("Analysis found:", analysis);

  try {
    setCreatingPlan(true);
    setError("");

    console.log("Calling backend...");

    const response = await fetch(
      "http://localhost:5000/api/create-test-plan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis: analysis,
        }),
      }
    );

    console.log("Backend response status:", response.status);

    const data = await response.json();

    console.log("Backend response:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to create test plan"
      );
    }

    console.log("TEST PLAN CREATED:", data.plan);

    setTestPlan(data.plan);
    useEffect(() => {
  console.log("TEST PLAN STATE UPDATED:", testPlan);
}, [testPlan]);

  } catch (error) {
    console.error("Test plan error:", error);
    setError(error.message);
  } finally {
    setCreatingPlan(false);
  }
};

const generateTests = async () => {
  if (!testPlan) return;

  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      "http://localhost:5000/api/generate-tests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: testPlan,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to generate tests");
    }

    setGeneratedTests(data.tests);

  } catch (error) {
    console.error(error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
const runTests = async () => {
  try {
    setRunningTests(true);
    setError("");
    setTestResult(null);

    const response = await fetch(
      "http://localhost:5000/api/run-tests",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to run tests");
    }

    setTestResult(data);
  } catch (error) {
    console.error(error);
    setError(error.message);
  } finally {
    setRunningTests(false);
  }
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
        {loading && (
  <section className="analysis-card">
    <div className="analysis-loading">
      <div className="loading-spinner"></div>
      <div>
        <h2>Analyzing requirement...</h2>
        <p>
          ReleaseGuard is identifying features, scenarios and risks.
        </p>
      </div>
    </div>
  </section>
)}

{error && (
  <section className="analysis-card error-card">
    <h2>Analysis failed</h2>
    <p>{error}</p>
  </section>
)}

{analysis && (
  <section className="analysis-card">
    <div className="analysis-header">
      <div>
        <span className="section-label">AI ANALYSIS</span>
        <h2>{analysis.feature}</h2>
      </div>

      <span className="analysis-badge">ANALYZED</span>
    </div>

    <p className="analysis-summary">
      {analysis.summary}
    </p>

    <div className="analysis-section">
      <h3>Expected behavior</h3>
      <p>{analysis.expectedBehavior}</p>
    </div>

    <div className="analysis-section">
      <h3>Test scenarios</h3>

      <div className="scenario-list">
        {analysis.scenarios.map((scenario, index) => (
          <div className="scenario-item" key={index}>
            <span>✓</span>
            {scenario}
          </div>
        ))}
      </div>
    </div>

    <div className="analysis-section">
      <h3>Identified risks</h3>

      <div className="risk-list">
        {analysis.risks.map((risk, index) => (
          <div className="risk-item" key={index}>
            <span className={`risk-level ${risk.level.toLowerCase()}`}>
              {risk.level}
            </span>

            <div>
              <strong>{risk.title}</strong>
              <p>{risk.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    
    <button onClick={createTestPlan} disabled={creatingPlan}>
  {creatingPlan
    ? "Creating Test Plan..."
    : "Create Test Plan →"}
</button>
{testPlan && (
  <div style={{ marginTop: "20px", padding: "20px", border: "1px solid white" }}>
    <h2>TEST PLAN CREATED ✅</h2>

    <p>Feature: {testPlan.feature}</p>

    {testPlan.scenarios?.map((scenario) => (
      <p key={scenario.id}>
        {scenario.id}. {scenario.description} — {scenario.type}
      </p>
    ))}
  </div>
)}
{testPlan && (
  <div className="test-plan-section">
    <h2>Test Plan</h2>

    <p>
      <strong>Feature:</strong> {testPlan.feature}
    </p>

    <div className="test-plan-scenarios">
      {testPlan.scenarios?.map((scenario) => (
        <div className="test-scenario" key={scenario.id}>
          <div>
            <strong>
              {scenario.id}. {scenario.description}
            </strong>
          </div>

          <span className={`scenario-type ${scenario.type}`}>
            {scenario.type}
          </span>
        </div>
      ))}
    </div>
  </div>
)}
{testPlan && (
  <div className="generate-tests-section">
    <button
      className="generate-button"
      onClick={generateTests}
      disabled={loading}
    >
      {loading
        ? "Generating Tests..."
        : "Generate Playwright Tests →"}
    </button>
  </div>
)}
    {generatedTests && (
  <div className="generated-tests">
    <h3>Generated Playwright Test</h3>

    <pre>
      <code>{generatedTests}</code>
    </pre>
  </div>
)}
{generatedTests && (
  <button
    onClick={runTests}
    disabled={runningTests}
  >
    {runningTests ? "Running Tests..." : "Run Playwright Tests →"}
  </button>
)}
{testResult && (
  <div className="test-result">

    <h2>Test Execution</h2>

    <div className={testResult.passed ? "passed" : "failed"}>
      {testResult.passed
        ? "✓ All Tests Passed"
        : "✕ Test Failed"}
    </div>

    {testResult.failure && (
      <div className="failure-analysis">

        <h2>AI Failure Analysis</h2>

        <p>
          <strong>Severity:</strong>{" "}
          {testResult.failureAnalysis.severity}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {testResult.failureAnalysis.category}
        </p>

        <p>
          <strong>Title:</strong>{" "}
          {testResult.failureAnalysis.title}
        </p>

        <p>
          <strong>Expected:</strong>{" "}
          {testResult.failureAnalysis.expected}
        </p>

        <p>
          <strong>Actual:</strong>{" "}
          {testResult.failureAnalysis.actual}
        </p>

        <p>
          <strong>Likely Cause:</strong>{" "}
          {testResult.failureAnalysis.likelyCause}
        </p>

        <p>
          <strong>Business Impact:</strong>{" "}
          {testResult.failureAnalysis.businessImpact}
        </p>

        <p>
          <strong>Recommendation:</strong>{" "}
          {testResult.failureAnalysis.recommendation}
        </p>
        {testResult.failureAnalysis.evidence && (
  <div className="evidence-section">
    <h3>Failure Evidence</h3>

    {testResult.failureAnalysis.evidence.screenshot && (
      <div className="evidence-item">
        <span>Browser Screenshot</span>

        <img
          src={`http://localhost:5000/${testResult.failureAnalysis.evidence.screenshot}`}
          alt="Playwright failure screenshot"
        />
      </div>
    )}

    <div className="evidence-links">
      {testResult.failureAnalysis.evidence.video && (
        <a
          href={`http://localhost:5000/${testResult.failureAnalysis.evidence.video}`}
          target="_blank"
          rel="noreferrer"
        >
          View Test Video →
        </a>
      )}

      {testResult.failureAnalysis.evidence.trace && (
        <a
          href={`http://localhost:5000/${testResult.failureAnalysis.evidence.trace}`}
          target="_blank"
          rel="noreferrer"
        >
          Open Playwright Trace →
        </a>
      )}
    </div>
  </div>
)}

      </div>
    )}
    {testResult.releaseReadiness && (
  <div className="release-dashboard">

  <div className="release-dashboard-header">
    <div>
      <span className="section-label">
        RELEASE OVERVIEW
      </span>

      <h2>Checkout Release</h2>

      <p>
        Automated release analysis powered by
        browser testing and failure intelligence.
      </p>
    </div>

    <div className="release-status-badge">
      {testResult.releaseReadiness.status}
    </div>
  </div>

  <div className="release-score-panel">

    <div className="release-score">
      <span className="score-number">
        {testResult.releaseReadiness.score}
      </span>

      <span className="score-total">
        /100
      </span>
    </div>

    <div className="release-score-info">

      <span className="status-label">
        RELEASE READINESS
      </span>

      <h3>
        {testResult.releaseReadiness.status}
      </h3>

      <p>
        {testResult.releaseReadiness.summary}
      </p>

    </div>

  </div>

  <div className="release-metrics">

    <div className="release-metric">
      <span>TESTS PASSED: </span>

      <strong>
        {testResult.releaseReadiness.passedTests}
      </strong>
    </div>

    <div className="release-metric">
      <span>TESTS FAILED: </span>

      <strong>
        {testResult.releaseReadiness.failedTests}
      </strong>
    </div>

    <div className="release-metric">
      <span>RISK LEVE: L</span>

      <strong>
        {testResult.releaseReadiness.riskLevel}
      </strong>
    </div>

  </div>
  {testPlan && (
  <div className="test-plan-section">

    <div className="section-header">
      <span className="section-label">
        TEST INTELLIGENCE
      </span>

      <h2>Test Plan</h2>

      <p>
        ReleaseGuard identified the following scenarios
        from the requirement.
      </p>
    </div>

    <div className="test-plan-list">

    {testPlan.scenarios.map((scenario) => (
        <div
          className="test-plan-item"
          key={scenario.id}
        >

          <div className="test-plan-number">
            {scenario.id}
          </div>

          <div className="test-plan-content">

            <strong>
              {scenario.description}
            </strong>

            <span
              className={`scenario-type ${scenario.type}`}
            >
              {scenario.type.toUpperCase()}
            </span>

          </div>

        </div>
      ))}

    </div>

    

  </div>
)}

  {testResult.releaseReadiness.risks?.map(
    (risk, index) => (

      <div
        className="release-risk"
        key={index}
      >

        <div className="release-risk-severity">
          {risk.severity}
        </div>

        <div className="release-risk-content">

          <strong>
            {risk.title}
          </strong>

          <span>
            {risk.category}
          </span>

        </div>

      </div>

    )
  )}

</div>
)}

  </div>
)}
  </section>
)}
      </main>
    </div>
  );
}

export default App;