describe('Cars API', () => {
  beforeEach(() => {
    cy.loginAsUser();
    // Car created through the UI in 01-garage-add-car.cy.js
    cy.fixture('generated/createdCar').as('createdCar');
  });

  it('should return the car created through the UI in the car list', function () {
    const { id, brand, model, mileage } = this.createdCar;

    cy.apiRequest('GET', '/api/cars').then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.status).to.eq('ok');

      const car = body.data.find((item) => item.id === id);
      expect(car, `car with id ${id} in the list`).to.exist;
      expect(car).to.include({ id, brand, model, mileage });
    });
  });
});
