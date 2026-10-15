class GaragePage {
  // Page
  get addCarButton() {
    return cy.contains('button', 'Add car');
  }

  get carItems() {
    return cy.get('.car-list .car-item');
  }

  // "Add a car" modal
  get modal() {
    return cy.get('.modal-content');
  }

  get brandSelect() {
    return cy.get('#addCarBrand');
  }

  get modelSelect() {
    return cy.get('#addCarModel');
  }

  get mileageInput() {
    return cy.get('#addCarMileage');
  }

  get submitButton() {
    return this.modal.contains('.modal-footer button', /^Add$/);
  }

  visit() {
    cy.visitApp('/panel/garage');
    cy.contains('h1', 'Garage').should('be.visible');
    return this;
  }

  openAddCarModal() {
    this.addCarButton.should('be.enabled').click();
    this.modal.contains('.modal-title', 'Add a car').should('be.visible');
    return this;
  }

  fillCarForm({ brand, model, mileage }) {
    this.brandSelect.select(brand);
    this.modelSelect.select(model);
    this.mileageInput.clear().type(String(mileage));
    return this;
  }

  submitCarForm() {
    this.submitButton.should('be.enabled').click();
    this.modal.should('not.exist');
    return this;
  }

  addCar(car) {
    return this.openAddCarModal().fillCarForm(car).submitCarForm();
  }

  getCarItem(brand, model) {
    return this.carItems
      .filter(`:has(.car_name:contains("${brand} ${model}"))`)
      .first();
  }

  openAddFuelExpense(brand, model) {
    this.getCarItem(brand, model)
      .find('.car_add-expense')
      .click();
    return this;
  }
}

module.exports = new GaragePage();
