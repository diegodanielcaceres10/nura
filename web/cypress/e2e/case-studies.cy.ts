describe('Case study pages', () => {
  const slugs = ['legacy-codebase-modernization', 'cicd-pipeline-automation', 'recurring-bugs-reduction', 'legacy-mobile-migration', 'cloud-storage-migration'];

  it('opens a case from its card and goes back to the section', () => {
    cy.visit('/es');

    cy.get('.case-study__link').first().click();

    cy.url().should('include', '/es/case-studies/legacy-codebase-modernization');
    cy.get('h1.case-page__title').should('be.visible');

    cy.get('.case-page__back').click();

    cy.url().should('match', /\/es#case-study$/);
  });

  it('loads a case by deep link', () => {
    cy.visit('/en/case-studies/cloud-storage-migration');

    cy.get('h1.case-page__title').should('be.visible');
    cy.get('[data-section]').should('have.length.greaterThan', 0);
  });

  it('shows the not-found state for an unknown case', () => {
    cy.visit('/en/case-studies/does-not-exist');

    cy.get('.case-page__not-found').should('be.visible');
  });

  describe('on a phone', () => {
    slugs.forEach((slug) => {
      it(`does not scroll sideways on ${slug}`, () => {
        cy.viewport(375, 800);
        cy.visit(`/pt/case-studies/${slug}`);

        cy.get('h1.case-page__title').should('be.visible');
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
        });
      });
    });
  });
});
