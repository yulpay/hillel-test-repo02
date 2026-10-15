# Homework 21: Task Report

## Test users

| App | Email | Password |
|---|---|---|
| https://qauto.forstudy.space | jp.qauto.1791974863@test.com | Qauto12345 |
| https://qauto2.forstudy.space | jp.qauto2.1791974863@test.com | Qauto12345 |

Both users were registered through the signup API (`status: ok`).

## New files

| File | What it does | Why |
|---|---|---|
| `cypress/config/qauto.config.js` | Settings for qauto: `baseUrl`, user email and password. Inherits everything else from the main config. | Task 1 |
| `cypress/config/qauto2.config.js` | The same for qauto2 (the buggy app), with a different user. | Task 1 |
| `cypress/pages/GaragePage.js` | Page object for the Garage page and the "Add a car" form. | Task 4 (POM) |
| `cypress/pages/ExpensesPage.js` | Page object for the Fuel expenses page and the "Add an expense" form. | Task 4 (POM) |
| `cypress/e2e/garage.cy.js` | Test: adds a car through the UI and checks the server response and the car card. | Task 4 |
| `cypress/e2e/expenses.cy.js` | 2 tests: add a fuel expense from the Fuel expenses page, and from the car card in the Garage. The car is created through the API as a precondition. | Task 4 |
| `cypress/fixtures/cars.json` | Car test data (brand, model, mileage). | Keeps data out of the tests |
| `.gitignore` | Ignores `node_modules`, reports, screenshots and videos. | Keeps the repo clean |
| `TASK_REPORT.md` | This report. | |

## Changed files

| File | Change | Why |
|---|---|---|
| `cypress.config.js` | Added the mochawesome reporter settings and the shared site login (`guest` / `welcome2qauto`). Excluded the Cypress sample specs. | Task 3 |
| `package.json` | Added mochawesome packages and the scripts listed below. | Tasks 2–3 |
| `package-lock.json`, `node_modules/.package-lock.json` | Updated automatically by `npm install`. | Tasks 2–3 |
| `cypress/support/commands.js` | Added `cy.visitApp` (opens a page with the site login), `cy.loginAsUser` (logs in once and reuses the session) and API helpers (`apiCreateCar`, `apiDeleteAllCars`). Fixed `cy.login`, which clicked "Guest log in" instead of "Sign In". Switched to `cy.env()`, which Cypress 16 requires. | Task 4, plus bug fixes |
| `README.md` | Documented the environments, scripts, report and page objects. | Docs |

## Scripts

```
npm run test:qauto        # run tests on qauto
npm run test:qauto2       # run tests on qauto2
npm run cy:open:qauto     # open Cypress UI for qauto
npm run cy:open:qauto2    # open Cypress UI for qauto2
npm run report:merge      # merge JSON results
npm run report:generate   # build cypress/reports/report.html
npm run report:clean      # delete old results
```

## Results

| Spec | qauto | qauto2 |
|---|---|---|
| garage.cy.js (1 test) | ✅ pass | ✅ pass |
| expenses.cy.js (2 tests) | ✅ pass | ✅ pass |
| navigation.cy.js (8 tests, existing) | ✅ pass | ✅ pass |
| registration.cy.js (10 tests, existing) | ✅ pass | ❌ 1 fail |

The qauto2 failure is a bug in the app: the error "Last name has to be from 2 to 20 characters long" never appears. The test is correct, so it was left unchanged.

## Notes

- `node_modules` is already tracked by git, so `.gitignore` has no effect on it yet. To stop tracking it, run `git rm -r --cached node_modules`.
- In the VS Code terminal, run `unset ELECTRON_RUN_AS_NODE` before Cypress, or it won't start.
