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

        // Extract evidence paths directly from Playwright output.
        const pngMatch = output.match(
          /test-results[\/\\][^\r\n\s]+\.png/
        );

        const webmMatch = output.match(
          /test-results[\/\\][^\r\n\s]+\.webm/
        );

        const zipMatch = output.match(
          /test-results[\/\\][^\r\n\s]+\.zip/
        );

        const normalizePath = (value) =>
          value ? value.replace(/\\/g, "/") : null;

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

                screenshot: normalizePath(
                  pngMatch ? pngMatch[0] : null
                ),

                trace: normalizePath(
                  zipMatch ? zipMatch[0] : null
                ),

                video: normalizePath(
                  webmMatch ? webmMatch[0] : null
                ),
              }
            : null,
        });
      }
    );
  });
}

module.exports = { runPlaywright };