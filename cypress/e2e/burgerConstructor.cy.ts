describe('burgerConstructor adding ingredients test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'login.json' });
    cy.setCookie('accessToken', 'refreshToken');

    cy.get('[data-testid=643d69a5c3f7b9001cfa093c]').as('bun');
    cy.get('[data-testid=643d69a5c3f7b9001cfa0941]').as('main');
    cy.get('[data-testid=643d69a5c3f7b9001cfa0942]').as('sauce');
  });
  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  it('should add ingredient into constructor', () => {
    cy.get('@bun').contains('Добавить').click();
    cy.get('@main').contains('Добавить').click();
    cy.get('@sauce').contains('Добавить').click();

    cy.get('.constructor-element_pos_top').as('constructorTop');
    cy.get('@constructorTop').contains('Краторная булка N-200i (верх)');
    cy.get('.constructor-element').as('constructorInside');
    cy.get('@constructorInside').contains('Биокотлета из марсианской Магнолии');
    cy.get('.constructor-element_pos_bottom').as('constructorBottom');
    cy.get('@constructorBottom').contains('Краторная булка N-200i (низ)');
  });

  it('should check work of modal window of ingredient', () => {
    cy.contains('Краторная булка N-200i').click();

    cy.get('#modals').find('button').click();
    cy.get('#modals').should('be.empty');

    cy.contains('Краторная булка N-200i').click();
    cy.get('[data-testid=overlay]').click({ force: true });
    cy.get('#modals').should('be.empty');

    cy.contains('Краторная булка N-200i').click();
    cy.get('body').type('{esc}');
    cy.get('#modals').should('be.empty');
  });
});

describe('Order test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'login.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    cy.intercept('POST', '/api/auth/login', { fixture: 'login.json' });
    cy.setCookie('accessToken', 'refreshToken');

    cy.get('[data-testid=643d69a5c3f7b9001cfa093c]').as('bun');
    cy.get('[data-testid=643d69a5c3f7b9001cfa0941]').as('main');
    cy.get('[data-testid=643d69a5c3f7b9001cfa0942]').as('sauce');
  });
  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should create order', () => {
    cy.get('@bun').contains('Добавить').click();
    cy.get('@main').contains('Добавить').click();
    cy.get('@sauce').contains('Добавить').click();

    cy.contains('Оформить заказ').click();
    cy.get('#modals').should('be.not.empty');
    cy.get('#modals').find('h2').contains('48039');
    cy.get('#modals').find('button').click();
    cy.get('#modals').should('be.empty');

    cy.get('[data-testid=bunTop]').contains('Выберите булки');
    cy.get('[data-testid=mainMiddle]').contains('Выберите начинку');
    cy.get('[data-testid=bunBottom]').contains('Выберите булки');
  });
});

