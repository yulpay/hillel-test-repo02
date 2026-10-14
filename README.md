# hillel-test-repo02
repo for cypress homework

# QAuto Registration Tests

## Requirements
- Node.js
- npm
- Cypress
- Access to https://qauto.forstudy.space/

## Installation

Install Cypress:

npm install --save-dev cypress

## Run tests in UI mode

npx cypress open

1. Select E2E Testing.
2. Select a browser.
3. Open registration.cy.js.
4. Review the results in Cypress Test Runner.

## Run tests in headless mode

npx cypress run --spec "cypress/e2e/registration.cy.js"

## Custom commands

### UI login

cy.login(email, password)

### Mask sensitive input in logs

cy.get("#signupPassword")
  .type("TestPass123", { sensitive: true })

## Test coverage

- Required fields
- Name and Last name length
- Invalid characters
- Trimming surrounding spaces
- Email validation
- Password length and complexity
- Password confirmation
- Successful registration
- Login through the UI
- Password masking in Cypress logs