import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { MemoryRouter } from 'react-router-dom'
import { LOGIN_MUTATION } from '../login' // Import the mutation
import { Login } from '../login' // Import the Login component

describe('<Login />', () => {
  it('displays email validation errors', async () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid Email/i)
      ).toBeInTheDocument()
    })
  })

/*   it('displays password validation errors', async () => {
    render(
      <MockedProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    )

    const passwordInput = screen.getByPlaceholderText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(
        screen.getByText(/Password must be more than 10 chars./i)
      ).toBeInTheDocument()
    })
  }) */

  it('submits form and logs in successfully', async () => {
    const mockLoginResponse = {
      data: {
        login: {
          ok: true,
          token: 'mock-token',
          error: null,
        },
      },
    }

    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            loginInput: {
              email: 'test@example.com',
              password: 'password',
            },
          },
        },
        result: mockLoginResponse,
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const loginButton = screen.getByRole('button', { name: /LogIn/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-token')
    })
  })

  it('displays login error message', async () => {
    const mockLoginErrorResponse = {
      data: {
        login: {
          ok: false,
          token: null,
          error: 'Invalid credentials',
        },
      },
    }

    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            loginInput: {
              email: 'invalid@example.com',
              password: 'invalidpassword',
            },
          },
        },
        result: mockLoginErrorResponse,
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockedProvider>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const loginButton = screen.getByRole('button', { name: /LogIn/i })

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'invalidpassword' } })
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
    })
  })

  /* it('redirects to create account page', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    )

    const createAccountLink = screen.getByRole('link', {
      name: /Create an Account/i,
    })

    fireEvent.click(createAccountLink)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/create-account')
    })
  }) */
})
