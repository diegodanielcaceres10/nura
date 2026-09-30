describe('Premium Home Landing Section', () => {
  const viewports: { name: string; width: number; height: number }[] = [
    { name: 'Desktop (1440x900)', width: 1440, height: 900 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Mobile (375x812)', width: 375, height: 812 },
  ];

  viewports.forEach((vp) => {
    describe(`Viewport: ${vp.name}`, () => {
      beforeEach(() => {
        cy.viewport(vp.width, vp.height);
        cy.visit('/');
      });

      it('renders the luxury Hero section with key elements and Serif headline', () => {
        // Hero container exists and is visible
        cy.get('.home').should('be.visible');

        // Editorial typography: Serif headline name
        cy.get('.home__title-name').should('be.visible').and('contain.text', 'Diego Daniel Caceres');

        // High conversion CTA buttons
        cy.get('.home__cta--primary').should('be.visible').and('have.attr', 'href');

        cy.get('.home__cta--secondary').should('be.visible').and('have.attr', 'href');

        // Visual portrait and Diego's signature logo
        cy.get('.home__image').should('be.visible');
        cy.get('.home__signature').should('be.visible');

        // Floating tech badges
        cy.get('.home__tech-badge').should('have.length.at.least', 4);

        // Verification of no horizontal page overflow
        cy.window().then((win) => {
          expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 2);
        });
      });

      it('verifies CTA interaction states', () => {
        cy.get('.home__cta--primary').scrollIntoView().trigger('mouseover').should('be.visible');

        cy.get('.home__cta--secondary').scrollIntoView().trigger('mouseover').should('be.visible');
      });
    });
  });
});
