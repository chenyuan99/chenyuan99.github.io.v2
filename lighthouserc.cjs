module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost/", "http://localhost/notes/taxfront-document-semantics/", "http://localhost/notes/benchmarkllm-measurement-boundaries/"],
      numberOfRuns: 3,
      settings: { chromeFlags: "--no-sandbox --disable-dev-shm-usage" },
    },
    assert: {
      includePassedAssertions: true,
      assertions: {
        "categories:performance": ["error", { minScore: 0.90, aggregationMethod: "median" }],
        "categories:accessibility": ["error", { minScore: 0.95, aggregationMethod: "median" }],
        "categories:best-practices": ["error", { minScore: 0.95, aggregationMethod: "median" }],
        "categories:seo": ["error", { minScore: 0.95, aggregationMethod: "median" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "median" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "median" }],
        "total-blocking-time": ["error", { maxNumericValue: 200, aggregationMethod: "median" }],
        "resource-summary:script:size": ["error", { maxNumericValue: 30 * 1024 }],
        "resource-summary:font:size": ["error", { maxNumericValue: 200 * 1024 }],
        "resource-summary:total:size": ["error", { maxNumericValue: 500 * 1024 }],
      },
    },
    upload: { target: "filesystem", outputDir: "artifacts/lighthouse" },
  },
};
