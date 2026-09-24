function createTestPlan(analysis) {
  const scenarios = analysis.scenarios || [];

  return {
    feature: analysis.feature || "Unknown Feature",

    scenarios: scenarios.map((scenario, index) => ({
      id: index + 1,
      description: scenario,
      type: inferScenarioType(scenario),
    })),
  };
}

function inferScenarioType(scenario) {
  const text = scenario.toLowerCase();

  // Check negative cases first
  if (
    text.includes("invalid") ||
    text.includes("expired") ||
    text.includes("reject") ||
    text.includes("fail")
  ) {
    return "negative";
  }

  // Positive cases
  if (
    text.includes("valid") ||
    text.includes("success") ||
    text.includes("apply")
  ) {
    return "positive";
  }

  return "edge";
}

module.exports = {
  createTestPlan,
};