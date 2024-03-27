//@ts-nocheck
describe('Edit Profile', () => {
  const user = cy
  beforeEach(() => {
    user.loggedIn()
  })
  it('can go to edit profile using header', () => {
    user.get('a[href="/edit-profile"]').click()
    user.title().should('eq', 'Nuber')
  })
  it('can change Email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body.operationName === 'editProfile') {
        req.body?.variables?.input?.email = 'abdullembariti@gmail.com'
      }
    })

    user.visit('/edit-profile')
    user.findByPlaceholderText(/email/i).clear().type('new@lembariti.com')
    user.findByRole('button').click()
  })
})
