const { defineConfig } = require('cypress');
const baseConfig = require('../../cypress.config');

module.exports = defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: 'https://qauto.forstudy.space',
  },
  env: {
    ...baseConfig.env,
    userEmail: 'jp.qauto.1791974863@test.com',
    userPassword: 'Qauto12345',
  },
});
