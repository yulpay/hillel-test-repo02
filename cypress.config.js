const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },
  env: {
    httpUser: 'guest',
    httpPassword: 'welcome2qauto',
    // Default test user (qauto), so plain `npx cypress run` works
    userEmail: 'jp.qauto.1791974863@test.com',
    userPassword: 'Qauto12345',
  },
  e2e: {
    baseUrl: 'https://qauto.forstudy.space',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    // Cypress scaffolding examples are not part of the project test suite.
    excludeSpecPattern: [
      'cypress/e2e/1-getting-started/**',
      'cypress/e2e/2-advanced-examples/**',
    ],
    video: false,
    screenshotOnRunFailure: true,
  },
});
