// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Basic auth credentials of the environment (see cypress/config/*.config.js)
const withBasicAuth = (callback) =>
  cy
    .env(['httpUser', 'httpPassword'], { log: false })
    .then(({ httpUser, httpPassword }) =>
      callback({ username: httpUser, password: httpPassword })
    );

// Visit a page of the app behind HTTP basic auth
Cypress.Commands.add('visitApp', (path = '/') => {
  withBasicAuth((auth) => cy.visit(path, { auth }));
});

// Authenticated API request (relies on the session cookie set by login)
Cypress.Commands.add('apiRequest', (method, url, body) => {
  return withBasicAuth((auth) => cy.request({ method, url, body, auth }));
});

// Custom UI login command
Cypress.Commands.add('login', (email, password) => {
  cy.visitApp('/');

  // If a user is already authenticated, log out first.
  cy.get('body').then(($body) => {
    const logoutLink = $body.find(
      'a, button'
    ).filter((_, element) => {
      return /log out|logout|sign out/i.test(
        element.innerText || ''
      );
    });

    if (logoutLink.length) {
      cy.wrap(logoutLink.first()).click();
    }
  });

  // Open the Sign in form.
  // Use the exact selector: a text match would also hit "Guest log in".
  cy.get('button.header_signin').should('be.visible').click();

  // Enter credentials.
  cy.get('#signinEmail')
    .should('be.visible')
    .clear()
    .type(email);

  cy.get('#signinPassword')
    .should('be.visible')
    .clear()
    .type(password, { sensitive: true });

  // Submit the form.
  cy.contains('button', /^login$/i)
    .filter(':visible')
    .should('be.enabled')
    .click();
});

Cypress.Commands.overwrite(
  'type',
  (originalFn, element, text, options = {}) => {
    const { sensitive, ...typeOptions } = options;

    if (sensitive) {
      typeOptions.log = false;

      Cypress.log({
        $el: element,
        name: 'type',
        message: '*'.repeat(String(text).length),
      });
    }

    return originalFn(element, text, typeOptions);
  }
);

// Log in as the user of the current environment, cached between tests
Cypress.Commands.add('loginAsUser', () => {
  cy.env(['userEmail', 'userPassword'], { log: false }).then(
    ({ userEmail, userPassword }) => {
      cy.session(
        [Cypress.config('baseUrl'), userEmail],
        () => {
          cy.login(userEmail, userPassword);
          cy.location('pathname').should('eq', '/panel/garage');
        },
        {
          cacheAcrossSpecs: true,
          validate() {
            cy.apiRequest('GET', '/api/users/current')
              .its('status')
              .should('eq', 200);
          },
        }
      );
    }
  );
});

// Test data helpers
Cypress.Commands.add('apiCreateCar', ({ carBrandId, carModelId, mileage }) => {
  return cy
    .apiRequest('POST', '/api/cars', { carBrandId, carModelId, mileage })
    .its('body.data');
});

// POST /api/expenses; yields the full response
Cypress.Commands.add('createExpense', (body) => {
  return cy.apiRequest('POST', '/api/expenses', body);
});

Cypress.Commands.add('apiDeleteAllCars', () => {
  cy.apiRequest('GET', '/api/cars').then(({ body }) => {
    body.data.forEach(({ id }) => {
      cy.apiRequest('DELETE', `/api/cars/${id}`);
    });
  });
});
