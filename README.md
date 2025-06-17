# cypress_extended_tests_and_utilities
This repository provides a well-structured Cypress testing framework designed for scalable behavorial-driven-testing and integration testing. 


- This project uses the [GoREST API](https://gorest.co.in/) — a powerful, free RESTful service for testing HTTP methods such as GET, POST, PUT, and DELETE. It provides dummy users, posts, comments, and more, making it ideal for end-to-end and API automation testing scenarios.
Go to given link and generate an API token for personal use.

- This project uses [Supabase](https://supabase.com/) - an open-source Firebase alternative that provides instant APIs, authentication, and a Postgres database. In this project, Supabase is leveraged for handling user authentication and role-based access control, enabling secure and scalable testing environments.
Go to Supabase, signup, create a project. use Project reference and sign up using curl:

```curl --location 'https://${{project_reference_no}}$.supabase.co/auth/v1/signup' \
--header 'Content-Type: application/json' \
--header 'apikey: ${{your_api_key}}' \
--data-raw '{
  "email": "${{useremail}}",
  "password": "${{userPassword}}"
}'```

> Ideal for QA Engineers and SDETs who want reusable, modular, and CI/CD-ready Cypress test automation.

This project includes:
- [x] Framework with BDD approach using Cucumber (Feature files in Gherkin syntax) 
- [x] Cypress tests using `.cy.js` and `.feature` conventions
- [x] `it()` blocks and `step_definitions` include logs and response error validations
- [x] Secure handling of secrets using GitHub Secrets in Workflows
- [x] Utility methods for working with tokens and reading user info from tokens
- [x] Allure reporting (`allure-cypress/reporter`)
- [x] API Test Coverage
- [ ] UI Coverage


# Tech Stack

| Tool | Purpose |
|------|---------|
| [Cypress](https://www.cypress.io/) | E2E & integration testing |
| [Allure Reporter](https://github.com/allure-framework/allure-js) | Test result visualization |
| [GitHub Actions](https://github.com/cypress-io/github-action) | CI/CD pipeline |
| [Cucumber] | "@badeball/cypress-cucumber-preprocessor": "^22.1.0", "@bahmutov/cypress-esbuild-preprocessor": "^2.2.5",|
| [Cucumber Reporting] | multiple-cucumber-html-reporter |
| [JWT Decode] | Browser library that helps decoding JWT tokens |

# Setup Project
- Clone
git clone https://github.com/chandreyee729/cypress_extended_tests_and_utilities.git
- Install Dependencies
npm install
- Set environment Variables in `cypress.env.json`


# Running Tests
- Headless Run (Local)
npx cypress run --spec "cypress/e2e/integration_tests/*.cy.js" 
- Open Cypress GUI
npx cypress open

# Allure Reporting
-Generate 
npx allure generate allure-results --clean -o allure-report

-Open Report
npx allure open allure-report


# reports generated at Github Pages
Feature Tests: https://chandreyee729.github.io/cypress_extended_tests_and_utilities/bdd_feature_report/
Integration Tests: https://chandreyee729.github.io/cypress_extended_tests_and_utilities/integration_report/

Created By
Chandreyee Chakraborty
GitHub: @chandreyee729
