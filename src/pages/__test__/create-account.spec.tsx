/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-render-in-setup */
import React from 'react'
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from '../signUp'
import { ApolloProvider } from '@apollo/client'
import { createMockClient, MockApolloClient } from 'mock-apollo-client'
import {
  fireEvent,
  getAllByRole,
  getByRole,
  render,
  RenderResult,
  screen,
  waitFor,
} from '../../test-utilities'
import userEvent from '@testing-library/user-event'
import { UserRole } from '../../__generated__/globalTypes'
// import userEvent from '@testing-library/user-event'

const mockPush = jest.fn()

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom')
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      }
    },
  }
})

describe('CreateAccount', () => {
  let mockedClient: MockApolloClient
  let renderResult: RenderResult

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient()
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      )
    })
  })

  it('renders correctly', async () => {
    await waitFor(() => {
      expect(document.title).toBe('CreateAccount || Nuber')
    })
  })

  it('renders validation error for invalid email', async () => {
    const { getByRole } = renderResult
    const email = screen.getByPlaceholderText('Email')
    fireEvent.change(email, { target: { value: 'invalidemail' } })
    fireEvent.blur(email)

    const password = screen.getByPlaceholderText(/password/i)

    const button = screen.getByRole('button')

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid Email/i)
      ).toBeInTheDocument()
    })

    await waitFor(() => {
      userEvent.type(email, 'test@example.example')
      userEvent.click(button)
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

 /*  it('submits mutation with form values', async () => {
    const { getByRole, getByPlaceholderText } = renderResult
    const email = getByPlaceholderText(/email/i)
    const password = getByPlaceholderText(/password/i)
    const button = getByRole('button')
    const formData = {
      email: 'working@mail.com',
      password: '12',
      role: UserRole.Client,
    }
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation-error',
        },
      },
    })
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    )
    jest.spyOn(window, 'alert').mockImplementation(() => null)
    await waitFor(() => {
      userEvent.type(email, formData.email)
      userEvent.type(password, formData.password)
      userEvent.click(button)
    })
    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1)
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    })
    expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!')
    const mutationError = getByRole('alert')
    expect(mockPush).toHaveBeenCalledWith('/')
    expect(mutationError).toHaveTextContent('mutation-error')
  }) */
  afterAll(() => {
    jest.clearAllMocks()
  })
})
