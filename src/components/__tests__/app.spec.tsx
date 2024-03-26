/* eslint-disable testing-library/prefer-screen-queries */
import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { App } from '../app'
import { isLoggedInVar } from '../../apollo'

jest.mock('../../routers/logged-out-router', () => {
  return {
    LoggedOut: () => <span>Logged Out</span>,
  }
})

jest.mock('../../routers/logged-in-router', () => {
  return {
    LoggedIn: () => <span>Logged-In</span>,
  }
})

describe('<App />', () => {
  it('renders LoggedOut', () => {
    const { getByText } = render(<App />)
    getByText('Logged Out')
  })

  it('renders LoggedIn', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { getByText, debug } = render(<App />)
    await waitFor(() => {
      isLoggedInVar(true)
    })
    getByText('Logged-In')
  }) 
})
