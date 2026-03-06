describe('Nura app', () => {
  it('loads the main application shell', () => {
    cy.visit('/');
    cy.get('app-root').should('exist');
  });
});
