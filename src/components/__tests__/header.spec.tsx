/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, waitFor } from '@testing-library/react'
import { Header } from '../header'
import { ME_QUERY } from '../../hooks/useMe'
import { idText } from 'typescript'

describe('<Header />', () => {
  it('renders verify banner', async () => {
    await waitFor(async () => {
      const { getByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: false,
                  },
                },
              },
            },
          ]}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      )
      await new Promise((resolve) => setTimeout(resolve, 0))
      getByText('Please Verify Your Email')
    })
  })
  it('renders without verify banner', async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: '',
                    role: '',
                    verified: true,
                  },
                },
              },
            },
          ]}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      )
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(queryByText('Please verify your email.')).toBeNull()
    })
  })
})
