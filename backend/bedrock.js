const {
  BedrockRuntimeClient,
  ConverseCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: "ap-south-1",
});

const MODEL_ID = "global.amazon.nova-2-lite-v1:0";

async function analyzeRequirement(requirement) {
  const systemPrompt = `
You are ReleaseGuard AI, an expert software QA and release engineering assistant.

Your job is to analyze software requirements and identify:
1. The feature being described
2. Expected behavior
3. Test scenarios
4. Potential release risks

Return ONLY valid JSON.

Use exactly this structure:

{
  "feature": "string",
  "summary": "string",
  "expectedBehavior": "string",
  "scenarios": [
    "string"
  ],
  "risks": [
    {
      "level": "HIGH | MEDIUM | LOW",
      "title": "string",
      "description": "string"
    }
  ]
}

Rules:
- Generate practical software testing scenarios.
- Include positive and negative scenarios when appropriate.
- Identify business logic risks.
- Do not invent requirements that are not reasonably implied.
- Keep the response concise.
`;

  const command = new ConverseCommand({
    modelId: MODEL_ID,

    system: [
      {
        text: systemPrompt,
      },
    ],

    messages: [
      {
        role: "user",
        content: [
          {
            text: `Analyze this software requirement:

${requirement}`,
          },
        ],
      },
    ],

    inferenceConfig: {
      maxTokens: 1200,
      temperature: 0.2,
    },
  });

  const response = await client.send(command);

  const text = response.output.message.content
    .map((item) => item.text || "")
    .join("");

  return JSON.parse(text);
}

module.exports = {
  analyzeRequirement,
};