describe('Navigation', () => {
beforeEach(() => {
  cy.visit('/', {
    auth: {
      username: 'guest',
      password: 'welcome2qauto',
    },
  });
});

  describe('Header', () => {
    it('should display all header navigation elements', () => {
      cy.get('header.header').within(() => {
        cy.contains('a.header-link', 'Home')
          .should('be.visible');

        cy.contains('button.header-link', 'About')
          .should('be.visible');

        cy.contains('button.header-link', 'Contacts')
          .should('be.visible');

        cy.contains('button.header-link', 'Guest log in')
          .should('be.visible');

        cy.contains('button.header_signin', 'Sign In')
          .should('be.visible');
      });
    });

    it('should have a valid Home link', () => {
      cy.get('header.header')
        .contains('a.header-link', 'Home')
        .should('have.attr', 'href', '/');
    });
  });

  describe('Header navigation', () => {
    it('should navigate to About section', () => {
      cy.get('header.header')
        .contains('button.header-link', 'About')
        .click();

      cy.get('#aboutSection')
        .should('be.visible');
    });

    it('should navigate to Contacts section', () => {
      cy.get('header.header')
        .contains('button.header-link', 'Contacts')
        .click();

      cy.get('#contactsSection')
        .should('be.visible');
    });
  });

  describe('Contacts', () => {
    it('should display all social media links', () => {
      cy.get('#contactsSection').within(() => {
        cy.get('a[href*="facebook.com"]')
          .should('be.visible');

        cy.get('a[href*="t.me"]')
          .should('be.visible');

        cy.get('a[href*="youtube.com"]')
          .should('be.visible');

        cy.get('a[href*="instagram.com"]')
          .should('be.visible');

        cy.get('a[href*="linkedin.com"]')
          .should('be.visible');
      });
    });

    it('should display company website link', () => {
      cy.get('#contactsSection')
        .contains('a.contacts_link', 'ithillel.ua')
        .should('be.visible')
        .and('have.attr', 'href', 'https://ithillel.ua');
    });

    it('should display support email link', () => {
      cy.get('#contactsSection')
        .contains('a.contacts_link', 'support@ithillel.ua')
        .should('be.visible')
        .and('have.attr', 'href', 'mailto:developer@ithillel.ua');
    });
  });

  describe('Footer', () => {
    it('should display the footer logo', () => {
      cy.get('footer.footer')
        .find('.footer_logo')
        .should('be.visible')
        .and('have.attr', 'href', '/');
    });
  });
});