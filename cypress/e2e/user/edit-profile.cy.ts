//@ts-nocheck
describe('Edit Profile', () => {
  const user = cy
  it('can go to edit profile using header', () => {
    user.loggedIn('abdullembariti@gmail.com', '123')
  })
})
