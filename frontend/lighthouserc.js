module.exports = {
  ci: {
    collect: {
      // Statically build the Next.js app before running Lighthouse
      staticDistDir: './.next',
      // Set the number of times Lighthouse will run on each URL
      numberOfRuns: 3,
    },
    assert: {
      // Assert performance metrics against predefined budgets
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      // Configure where to upload the reports
      target: 'temporary-public-storage',
    },
  },
};
