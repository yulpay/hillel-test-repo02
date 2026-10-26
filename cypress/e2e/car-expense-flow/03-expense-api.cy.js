const { CREATED_EXPENSE_FILE } = require('../../support/testData');

describe('Expenses API', () => {
  beforeEach(() => {
    cy.loginAsUser();
    // Car created through the UI in 01-garage-add-car.cy.js
    cy.fixture('generated/createdCar').as('createdCar');
  });

  it('should create a fuel expense for the created car', function () {
    const car = this.createdCar;
    const expense = {
      carId: car.id,
      // Today in YYYY-MM-DD; UTC so the server never sees a date in the future
      reportedAt: new Date().toISOString().slice(0, 10),
      mileage: car.mileage + 250,
      liters: 40,
      totalCost: 75.5,
    };

    cy.createExpense(expense).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.status).to.eq('ok');
      expect(body.data).to.include(expense);
      expect(body.data.id).to.be.a('number');

      // Share the created expense with the UI check
      cy.writeFile(CREATED_EXPENSE_FILE, body.data);
    });
  });
});
