class ExpensesPage {
  // Page
  get addExpenseButton() {
    return cy.contains('button', 'Add an expense');
  }

  get carSelectDropdown() {
    return cy.get('#carSelectDropdown');
  }

  get expensesTable() {
    return cy.get('.expenses_table');
  }

  get expenseRows() {
    return this.expensesTable.find('tbody tr');
  }

  // "Add an expense" modal
  get modal() {
    return cy.get('.modal-content');
  }

  get vehicleSelect() {
    return cy.get('#addExpenseCar');
  }

  get dateInput() {
    return cy.get('#addExpenseDate');
  }

  get mileageInput() {
    return cy.get('#addExpenseMileage');
  }

  get litersInput() {
    return cy.get('#addExpenseLiters');
  }

  get totalCostInput() {
    return cy.get('#addExpenseTotalCost');
  }

  get submitButton() {
    return this.modal.contains('.modal-footer button', /^Add$/);
  }

  visit() {
    cy.visitApp('/panel/expenses');
    cy.contains('h1', 'Fuel expenses').should('be.visible');
    return this;
  }

  openAddExpenseModal() {
    this.addExpenseButton.should('be.enabled').click();
    return this.shouldShowAddExpenseModal();
  }

  shouldShowAddExpenseModal() {
    this.modal.contains('.modal-title', 'Add an expense').should('be.visible');
    return this;
  }

  fillExpenseForm({ vehicle, mileage, liters, totalCost }) {
    if (vehicle) {
      this.vehicleSelect.select(vehicle);
    }

    this.mileageInput.clear().type(String(mileage));
    this.litersInput.clear().type(String(liters));
    this.totalCostInput.clear().type(String(totalCost));
    return this;
  }

  submitExpenseForm() {
    this.submitButton.should('be.enabled').click();
    this.modal.should('not.exist');
    return this;
  }

  selectCar(carName) {
    this.carSelectDropdown.click();
    cy.contains('.car-select-dropdown_item', carName).click();
    this.carSelectDropdown.should('contain', carName);
    return this;
  }

  getExpenseRow(mileage) {
    return this.expenseRows
      .filter(`:has(td:contains("${mileage}"))`)
      .first();
  }
}

module.exports = new ExpensesPage();
