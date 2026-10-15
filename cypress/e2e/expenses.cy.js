const garagePage = require('../pages/GaragePage');
const expensesPage = require('../pages/ExpensesPage');

describe('Fuel expenses', () => {
  let car;

  beforeEach(() => {
    cy.loginAsUser();
    cy.apiDeleteAllCars();

    // Precondition: a car in the garage, created via API to keep the test focused
    cy.fixture('cars').then(({ bmwX5 }) => {
      car = bmwX5;
      cy.apiCreateCar(car);
    });

    cy.intercept('POST', '/api/expenses').as('createExpense');
  });

  const expense = () => ({
    mileage: car.mileage + 250,
    liters: 40,
    totalCost: 75,
  });

  const verifyExpenseCreated = ({ mileage, liters, totalCost }) => {
    cy.wait('@createExpense').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.data).to.include({ mileage, liters, totalCost });
    });

    expensesPage.carSelectDropdown.should('contain', `${car.brand} ${car.model}`);
    expensesPage.expenseRows.should('have.length', 1);
    expensesPage
      .getExpenseRow(mileage)
      .should('be.visible')
      .and('contain', liters)
      .and('contain', totalCost);
  };

  it('should add a fuel expense from the Fuel expenses page', () => {
    const data = expense();

    expensesPage
      .visit()
      .openAddExpenseModal()
      .fillExpenseForm({ vehicle: `${car.brand} ${car.model}`, ...data })
      .submitExpenseForm();

    verifyExpenseCreated(data);
  });

  it('should add a fuel expense from the car card in the garage', () => {
    const data = expense();

    garagePage.visit().openAddFuelExpense(car.brand, car.model);

    expensesPage.shouldShowAddExpenseModal();

    // The modal is opened for the selected car and prefilled with its mileage
    expensesPage.vehicleSelect
      .find('option:selected')
      .should('have.text', `${car.brand} ${car.model}`);
    expensesPage.mileageInput.should('have.value', String(car.mileage));

    expensesPage
      .fillExpenseForm(data)
      .submitExpenseForm();

    cy.location('pathname').should('eq', '/panel/expenses');
    verifyExpenseCreated(data);
  });
});
