const { defineConfig } = require("cypress");
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const allureWriter = require("@shelex/cypress-allure-plugin/writer");


module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://gorest.co.in/',
    specPattern: ["cypress/e2e/**/*.feature", "cypress/e2e/**/*.cy.js"],
    supportFile: 'cypress/support/e2e.js',
    
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config); // Cucumber plugin setup
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)], // esbuild plugin for cucumber
        })
      );
      allureWriter(on, config);
      return config;
    }
  },
  env: {
    ...require('./cypress.env.json'),
    allureReuseAfterSpec: true,
    allure: true,
    allureResultsPath: 'allure-results',
  }
});
