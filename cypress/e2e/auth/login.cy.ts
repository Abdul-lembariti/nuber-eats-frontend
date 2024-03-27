describe('Log In', () => {
  const user = cy
  it('should see Login Page', () => {
    user.visit('/').title().should('eq', 'Nuber')
  })
  it('can see email & password errors', () => {
    user.visit('/')
    user.findByPlaceholderText(/email/i).type('abdullembariti2005')
    user.findByRole('alert').should('have.text', 'Please enter a valid Email')
    user.findByPlaceholderText(/email/i).clear()
    user.findByRole('alert').should('have.text', 'Email is required')
    user.findByPlaceholderText(/email/i).type('abdullembariti2005@gmail.com')
    user
      .findByPlaceholderText(/password/i)
      .type('a')
      .clear()
    user.findByRole('alert').should('have.text', 'Password is required')
  })
  it('can fill out the form and login', () => {
    //@ts-ignore
    user.loggedIn()
  })
})
