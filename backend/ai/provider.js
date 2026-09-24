const {
  analyzeRequirement: mockAnalyzeRequirement,
} = require("./mock-ai");

const {
  analyzeFailure: mockAnalyzeFailure,
} = require("./failure-analyzer");

const AI_PROVIDER = process.env.AI_PROVIDER || "mock";

async function analyze(requirement) {
  if (AI_PROVIDER === "bedrock") {
    const { analyzeRequirement: bedrockAnalyze } = require("../bedrock");

    return await bedrockAnalyze(requirement);
  }

  return await mockAnalyzeRequirement(requirement);
}

async function analyzeFailure(failure) {
  if (AI_PROVIDER === "bedrock") {
    // We'll connect Bedrock failure analysis here later.
    // Keeping this isolated makes the provider replaceable.
  }

  return mockAnalyzeFailure(failure);
}

module.exports = {
  analyze,
  analyzeFailure,
};