const expensesPage = require('../../pages/ExpensesPage');

describe('Fuel expenses page', () => {
  beforeEach(() => {
    cy.loginAsUser();
    // Data created in 01-garage-add-car.cy.js and 03-expense-api.cy.js
    cy.fixture('generated/createdCar').as('createdCar');
    cy.fixture('generated/createdExpense').as('createdExpense');
  });

  it('should show the expense created through the API', function () {
    const car = this.createdCar;
    const { reportedAt, mileage, liters, totalCost } = this.createdExpense;

    expensesPage.visit().selectCar(`${car.brand} ${car.model}`);

    expensesPage.expenseRows.should('have.length', 1);
    expensesPage
      .getExpenseRow(mileage)
      .should('be.visible')
      .find('td')
      .then(($cells) => {
        const [date, rowMileage, rowLiters, rowTotalCost] = Cypress._.map(
          $cells,
          (cell) => cell.innerText.trim()
        );

        expect(date).to.eq(expensesPage.formatDate(reportedAt));
        expect(rowMileage).to.eq(String(mileage));
        expect(rowLiters).to.contain(String(liters));
        expect(rowTotalCost).to.contain(String(totalCost));
      });
  });
});
