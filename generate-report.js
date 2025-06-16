const reporter = require('cucumber-html-reporter');
// convert the json report to html format
const options = {
  theme: 'bootstrap',
  jsonFile: 'cypress/reports/cucumber-json/cucumber.json',  // your JSON file or folder
  output: 'cypress/reports/cucumber-html-report/features/report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "STAGING",
    "Browser": "Chrome  92.0.4515.107",
    "Platform": "macOS",
    "Executed": "Local"
  }
};

reporter.generate(options);
