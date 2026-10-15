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

# Environments

| Config | App | File |
|---|---|---|
| qauto | https://qauto.forstudy.space | cypress/config/qauto.config.js |
| qauto2 (buggy version) | https://qauto2.forstudy.space | cypress/config/qauto2.config.js |

Both extend the main `cypress.config.js` (reporter settings, basic auth, spec patterns)
and define their own `baseUrl` and test user (`userEmail` / `userPassword`).

## Scripts

npm run cy:open:qauto      # open runner against qauto
npm run cy:open:qauto2     # open runner against qauto2
npm run test:qauto         # headless run against qauto
npm run test:qauto2        # headless run against qauto2

## Mochawesome report

Each run writes JSON results to `cypress/results`. Build an HTML report:

npm run report:merge
npm run report:generate    # -> cypress/reports/report.html
npm run report:clean       # remove old results before a new run

## Page Objects

- `cypress/pages/GaragePage.js` - garage page and "Add a car" modal
- `cypress/pages/ExpensesPage.js` - fuel expenses page and "Add an expense" modal

## Garage & Expenses coverage

- Add a car to the garage (`garage.cy.js`)
- Add a fuel expense from the Fuel expenses page (`expenses.cy.js`)
- Add a fuel expense from the car card in the garage (`expenses.cy.js`)

Note: when running from the VS Code integrated terminal, Cypress may fail to start
because of `ELECTRON_RUN_AS_NODE=1`; run `unset ELECTRON_RUN_AS_NODE` first.
