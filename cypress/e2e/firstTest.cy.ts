describe('Log In', () => {
  it('should see Login Page', () => {
    cy.visit('/').title().should('eq', 'Nuber')
  })
  it('can fill out the form', () => {
    cy.visit('/')
      .findAllByPlaceholderText(/email/i)
      .type('abdullembariti2005@gmail.com')
      .get('[name="password"]')
      .type('123')
      .findByRole('alert')
      .should('not.have.class', 'pointer-events-none')
    // to do canLogin()
  })
  it('can see email & password errors', () => {
    cy.visit('/')
      .get('[name="email"]')
      .type('abdullembariti2005')
      .get('.text-red-600')
      .should('have.text', 'Please enter a valid Email')
  })
})
