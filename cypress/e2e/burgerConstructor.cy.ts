describe('burgerConstructor test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  });

  it('should add ingredient into constructor', () => {
    cy.get('[data-test-id="ingredient-bun"]').first().trigger('dragstart');
    cy.get('[data-test-id="constructor"]').trigger('drop');
  });
});
