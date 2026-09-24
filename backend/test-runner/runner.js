const { exec } = require("child_process");
const path = require("path");

function runPlaywright() {
  return new Promise((resolve) => {
    exec(
      "npx playwright test tests/coupon.spec.js",
      {
        cwd: path.resolve(__dirname, "../.."),
      },
      (error, stdout, stderr) => {
        const output = `${stdout}\n${stderr}`;

        const expectedMatch = output.match(/Expected:\s*"([^"]+)"/);
        const actualMatch = output.match(/Received:\s*"([^"]+)"/);

        const screenshotMatch = output.match(
          /attachment #1: screenshot.*?\n\s*(test-results\\[^\n]+\.png)/
        );

        const traceMatch = output.match(
          /attachment #4: trace.*?\n\s*(test-results\\[^\n]+\.zip)/
        );

        const videoMatch = output.match(
          /attachment #2: video.*?\n\s*(test-results\\[^\n]+\.webm)/
        );

        resolve({
          passed: !error,

          output,

          failure: error
            ? {
                expected: expectedMatch
                  ? expectedMatch[1]
                  : null,

                actual: actualMatch
                  ? actualMatch[1]
                  : null,

                screenshot: screenshotMatch
  ? screenshotMatch[1].replace(/\\/g, "/")
  : null,

trace: traceMatch
  ? traceMatch[1].replace(/\\/g, "/")
  : null,

video: videoMatch
  ? videoMatch[1].replace(/\\/g, "/")
  : null,
              }
            : null,
        });
      }
    );
  });
}

module.exports = {
  runPlaywright,
};