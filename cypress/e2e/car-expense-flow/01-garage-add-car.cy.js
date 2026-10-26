const garagePage = require('../../pages/GaragePage');
const { CREATED_CAR_FILE } = require('../../support/testData');

describe('Garage', () => {
  beforeEach(() => {
    cy.loginAsUser();
    cy.apiDeleteAllCars();
    cy.fixture('cars').as('cars');
  });

  it('should add a car to the garage', function () {
    const car = this.cars.audiTT;

    cy.intercept('POST', '/api/cars').as('createCar');

    garagePage.visit().addCar(car);

    cy.wait('@createCar').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body.data).to.include({
        brand: car.brand,
        model: car.model,
        mileage: car.mileage,
      });

      const { id } = response.body.data;
      expect(id).to.be.a('number');
      cy.wrap(id).as('carId');

      // Share the created car with the next specs of the flow
      cy.writeFile(CREATED_CAR_FILE, {
        id,
        brand: car.brand,
        model: car.model,
        mileage: car.mileage,
      });
    });

    garagePage.carItems.should('have.length', 1);
    garagePage
      .getCarItem(car.brand, car.model)
      .should('be.visible')
      .within(() => {
        cy.get('.car_name').should('have.text', `${car.brand} ${car.model}`);
        cy.get('input[name="miles"]').should('have.value', String(car.mileage));
      });
  });
});
