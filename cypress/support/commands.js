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

// Custom UI login command



Cypress.Commands.add('login', (email, password) => {
  cy.visit('/', {
    auth: {
      username: 'guest',
      password: 'welcome2qauto',
    },
  });

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
  cy.contains('button, a', /sign in|login|log in/i)
    .filter(':visible')
    .first()
    .click();

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