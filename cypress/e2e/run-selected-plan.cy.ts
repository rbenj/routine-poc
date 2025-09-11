describe('Run Selected Plan E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  });

  it('Should choose a plan and run it while changing a field', () => {
    let originalWeight = 0;

    // Got to dashboard view
    cy.visit('/');

    // Observe that plans are present
    cy.contains('Pull Day').should('be.visible');

    // Go to a plan view by clicking on a plan
    cy.contains('Pull Day').click();
    cy.url().should('include', '/plan/pull-day');

    // Observe the plan view
    cy.findByRole('heading', { name: /Pull Day/i, level: 1 }).should('be.visible');

    // Remember the starting weight value of the first task with weight
    cy.contains('div', /Farmer/i).should('be.visible');
    cy.contains('div', /Weight/i).parent().within(() => {
      cy.contains(/\d+ lbs/).should('be.visible').invoke('text').then((text) => {
        const match = text.match(/(\d+)\s*lbs/);
        if (match) {
          originalWeight = Number(match[1]);
        }
      });
    });

    // Go to execute view for the plan by clicking on "Start" button
    cy.get('button').contains('Start').should('be.visible');
    cy.get('button').contains('Start').click();

    // Observe the exectute view for the plan
    cy.url().should('include', '/execute');
    cy.findByRole('heading', { name: /Pull Day/i, level: 1 }).should('be.visible');

    // Observe the first task
    cy.findByRole('heading', { name: /Warmup/i, level: 2 }).should('be.visible');

    // Start timer, observe the timer controls and continue to task follow up by stopping the timer prematurely
    cy.get('button').contains('Start').should('be.visible');
    cy.get('button').contains('Start').click();
    cy.findByLabelText('Pause timer').should('be.visible');
    cy.findByLabelText('Stop timer').should('be.visible');
    cy.findByLabelText('Stop timer').click();

    // Continue to post task rest by clicking on "Continue" button
    cy.get('button').contains('Continue').should('be.visible')
    cy.get('button').contains('Continue').click()

    // Observe post task rest and timer which should be auto running, and continue to next task by stopping the timer prematurely
    cy.findByRole('heading', { name: /Rest/i, level: 2 }).should('be.visible');
    cy.findByLabelText('Pause timer').should('be.visible');
    cy.findByLabelText('Stop timer').should('be.visible');
    cy.findByLabelText('Stop timer').click();

    // Observe the next task and that the weight matches the weight from the plan view
    cy.findByRole('heading', { name: /Farmer/i, level: 2 }).should('be.visible');
    cy.contains('div', /Weight/i).parent().within(() => {
      cy.contains(/\d+\s*lbs/).should('be.visible').invoke('text').then((text) => {
        const match = text.match(/(\d+)\s*lbs/);
        if (match) {
          expect(Number(match[1])).to.equal(originalWeight);
        }
      });
    });

    // Edit the weight field and close the overlay
    cy.contains('Weight').parent().find('button').first().click();
    cy.findByLabelText('Increase value').should('be.visible');
    cy.findByLabelText('Increase value').click();
    cy.findByLabelText('Close').should('be.visible');
    cy.findByLabelText('Close').click();

    // Observe that the weight value has changed
    cy.contains('Weight').parent().within(() => {
      cy.contains(/\d+\s*lbs/).should('be.visible').invoke('text').then((text) => {
        const match = text.match(/(\d+)\s*lbs/);
        if (match) {
          expect(Number(match[1])).to.equal(originalWeight + 1);
        }
      });
    });

    // Click the back button to go back to the plan view
    cy.findByLabelText('Back').should('be.visible');
    cy.findByLabelText('Back').click();

    // Observe that we are back on the plan view
    cy.findByRole('heading', { name: /Pull Day/i, level: 1 }).should('be.visible');

    // Check that the weight value has been persisted
    cy.contains('Weight').parent().within(() => {
      cy.contains(/\d+\s*lbs/).should('be.visible').invoke('text').then((text) => {
        const match = text.match(/(\d+)\s*lbs/);
        if (match) {
          expect(Number(match[1])).to.equal(originalWeight + 1);
        }
      });
    });
  });
});
