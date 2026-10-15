const { defineConfig } = require('cypress');
const baseConfig = require('../../cypress.config');

module.exports = defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: 'https://qauto2.forstudy.space',
  },
  env: {
    ...baseConfig.env,
    userEmail: 'jp.qauto2.1791974863@test.com',
    userPassword: 'Qauto12345',
  },
});
