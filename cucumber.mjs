export default {
  default: {
    paths: ['features/**/*.feature'],
    import: [
      'support/world.mjs',
      'support/hooks.mjs',
      'step_definitions/wait.steps.mjs',
      'step_definitions/store_checkout.steps.mjs',
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      '@cucumber/pretty-formatter',
    ],
    formatOptions: {
      snippetInterface: 'async',
    },
    parallel: 2,  // Run 3 scenarios in parallel (optimal balance)
  },
};
