
const validPassword = 'TestPass123';

let emailCounter = 0;

const uniqueEmail = () => {
  emailCounter += 1;

  // Generate a different address for every test execution.
  // Replace example.com if the application requires a domain you control.
  return `qa+jp${Date.now()}${emailCounter}@example.com`;
};

const selectors = {
  name: '#signupName',
  lastName: '#signupLastName',
  email: '#signupEmail',
  password: '#signupPassword',
  repeatPassword: '#signupRepeatPassword',
};

const field = (name) =>
  cy.get(selectors[name]).filter(':visible').first();

const visitApp = () => {
  cy.visit('/', {
    auth: {
      username: 'guest',
      password: 'welcome2qauto',
    },
  });
};

const openRegistration = () => {
  visitApp();

  cy.contains('button, a', /registration|sign up|signup/i)
    .filter(':visible')
    .first()
    .click();
};

const fillValidForm = (email) => {
  field('name').clear().type('Taylor');
  field('lastName').clear().type('Morgan');
  field('email').clear().type(email);

  field('password')
    .clear()
    .type(validPassword, { sensitive: true });

  field('repeatPassword')
    .clear()
    .type(validPassword, { sensitive: true });
};

describe('Registration form', () => {
  beforeEach(() => {
    openRegistration();
  });

  it('should display empty fields and keep Register disabled', () => {
    field('name').should('be.visible').and('have.value', '');
    field('lastName').should('be.visible').and('have.value', '');
    field('email').should('be.visible').and('have.value', '');
    field('password').should('be.visible').and('have.value', '');
    field('repeatPassword').should('be.visible').and('have.value', '');

    cy.contains('button', /^register$/i)
      .should('be.visible')
      .and('be.disabled');
  });

  it('should validate Name length from 2 to 20 characters', () => {
    field('name').clear().type('A').blur();

    cy.contains(
      'Name has to be from 2 to 20 characters long'
    ).should('be.visible');

    field('name').clear().type('A'.repeat(21)).blur();

    cy.contains(
      'Name has to be from 2 to 20 characters long'
    ).should('be.visible');

    field('name').clear().type('Taylor').blur();

    cy.contains(
      'Name has to be from 2 to 20 characters long'
    ).should('not.exist');
  });

  it('should validate Last name length from 2 to 20 characters', () => {
    field('lastName').clear().type('B').blur();

    cy.contains(
      'Last name has to be from 2 to 20 characters long'
    ).should('be.visible');

    field('lastName').clear().type('B'.repeat(21)).blur();

    cy.contains(
      'Last name has to be from 2 to 20 characters long'
    ).should('be.visible');

    field('lastName').clear().type('Morgan').blur();

    cy.contains(
      'Last name has to be from 2 to 20 characters long'
    ).should('not.exist');
  });

  it('should reject invalid Name and Last name characters', () => {
    field('name').clear().type('Tay!or').blur();

    cy.contains('Name is invalid').should('be.visible');

    field('name').clear().type('Taylor');

    field('lastName').clear().type('Morg@n').blur();

    cy.contains('Last name is invalid').should('be.visible');
  });

  it('should validate names with surrounding spaces', () => {
    field('name').clear().type('  Taylor  ').blur();
    field('lastName').clear().type('  Morgan  ').blur();

    cy.contains(
      'Name has to be from 2 to 20 characters long'
    ).should('not.exist');

    cy.contains(
      'Last name has to be from 2 to 20 characters long'
    ).should('not.exist');
  });

  it('should reject an invalid email address', () => {
    field('email').clear().type('not-an-email').blur();

    cy.contains('Email is incorrect').should('be.visible');

    cy.contains('button', /^register$/i)
      .should('be.disabled');
  });

  it('should reject a password shorter than 8 characters', () => {
    field('password')
      .clear()
      .type('Ab1', { sensitive: true })
      .blur();

    cy.contains(
      /password has to be from 8 to 15 characters long/i
    ).should('be.visible');
  });

  it('should require uppercase, lowercase and a digit', () => {
    field('password')
      .clear()
      .type('alllowercase1', { sensitive: true })
      .blur();

    cy.contains(
      /password has to be from 8 to 15 characters long and contain/i
    ).should('be.visible');

    field('password')
      .clear()
      .type('ALLUPPERCASE1', { sensitive: true })
      .blur();

    cy.contains(
      /password has to be from 8 to 15 characters long and contain/i
    ).should('be.visible');
  });

  it('should reject passwords that do not match', () => {
    field('password')
      .clear()
      .type(validPassword, { sensitive: true });

    field('repeatPassword')
      .clear()
      .type('Different123', { sensitive: true })
      .blur();

    cy.contains('Passwords do not match').should('be.visible');

    cy.contains('button', /^register$/i)
      .should('be.disabled');
  });

  it('should register a new user with a unique email', () => {
    const email = uniqueEmail();

    // Register the listener before submitting the form.
    cy.intercept('POST', '**/api/auth/signup').as('signup');

    fillValidForm(email);

    field('email').should('have.value', email);

    cy.contains('button', /^register$/i)
      .should('be.enabled')
      .click();

    // Verify the actual registration API response.
    cy.wait('@signup').then(({ response, request }) => {
      expect(response, 'signup response').to.exist;
      expect(response.statusCode).to.equal(201);
      expect(JSON.stringify(request.body)).to.include(email);
    });

    // Confirm the registration dialog is no longer visible.
    // The element may remain in the DOM but be hidden.
    cy.get('#signupEmail').should('not.be.visible');
  });
});