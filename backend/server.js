require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createTestPlan } = require("./ai/test-planner");

const {
  analyze,
  analyzeFailure,
} = require("./ai/provider");
const { generatePlaywrightTests } = require("./ai/test-generator");

const { runPlaywright } = require("./test-runner/runner");
const {
  calculateReleaseReadiness,
} = require("./ai/release-analyzer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(
  "/test-results",
  express.static(path.join(__dirname, "../test-results"))
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ReleaseGuard AI backend is running",
  });
});

// AI requirement analysis
app.post("/api/analyze", async (req, res) => {
  const { requirement } = req.body;

  if (!requirement || !requirement.trim()) {
    return res.status(400).json({
      success: false,
      message: "Requirement is required",
    });
  }

  try {
    const analysis = await analyze(requirement);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Bedrock analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze requirement",
      error: error.message,
    });
  }
});
app.post("/api/create-test-plan", async (req, res) => {
  const { analysis } = req.body;

  if (!analysis) {
    return res.status(400).json({
      success: false,
      message: "Analysis is required",
    });
  }

  try {
    const plan = createTestPlan(analysis);

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Test planning error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create test plan",
      error: error.message,
    });
  }
});
app.post("/api/generate-tests", async (req, res) => {
  const { plan } = req.body;

  if (!plan) {
    return res.status(400).json({
      success: false,
      message: "Test plan is required",
    });
  }

  try {
    const tests = generatePlaywrightTests(plan);

    res.json({
      success: true,
      tests,
    });
  } catch (error) {
    console.error("Test generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate tests",
      error: error.message,
    });
  }
});
app.post("/api/analyze-failure", async (req, res) => {
  const { failure } = req.body;

  if (!failure) {
    return res.status(400).json({
      success: false,
      message: "Failure data is required",
    });
  }

  try {
    const analysis = await analyzeFailure(failure);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Failure analysis error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze test failure",
      error: error.message,
    });
  }
});
app.post("/api/run-tests", async (req, res) => {
  try {
    const result = await runPlaywright();

    let failureAnalysis = null;

    if (!result.passed && result.failure) {
      failureAnalysis = await analyzeFailure(result.failure);
    }

    const releaseReadiness = calculateReleaseReadiness({
      failureAnalysis,
    });

    res.json({
      success: true,
      passed: result.passed,
      failure: result.failure,
      failureAnalysis,
      releaseReadiness,
      output: result.output,
    });

  } catch (error) {
    console.error("Test execution error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to execute Playwright tests",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ReleaseGuard API running on http://localhost:${PORT}`);
});