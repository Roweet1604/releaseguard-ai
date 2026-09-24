function calculateReleaseReadiness(testResult) {
  const failure = testResult.failureAnalysis;

  if (!failure) {
    return {
      status: "READY",
      score: 100,
      summary: "All automated tests passed.",
      riskLevel: "LOW",
    };
  }

  let score = 100;

  if (failure.severity === "HIGH") {
    score -= 35;
  }

  if (failure.severity === "MEDIUM") {
    score -= 20;
  }

  if (failure.severity === "LOW") {
    score -= 10;
  }

  return {
    status: score < 70 ? "READY WITH RISKS" : "READY",
    score,

    summary:
      "Automated testing identified a release risk that requires investigation before shipping.",

    riskLevel: failure.severity,

    failedTests: 1,

    passedTests: 0,

    risks: [
      {
        severity: failure.severity,
        category: failure.category,
        title: failure.title,
      },
    ],
  };
}

module.exports = {
  calculateReleaseReadiness,
};