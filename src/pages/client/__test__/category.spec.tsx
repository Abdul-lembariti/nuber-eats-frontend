import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom' // Import Routes and useParams
import { MockedProvider } from '@apollo/client/testing'
import { CATEGORYQUERY, Category } from '../category' // Make sure to import the Category component and its query
import { ApolloProvider } from '@apollo/client'
import { MockApolloClient } from 'mock-apollo-client'

// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}))

describe('Category component', () => {
  beforeEach(() => {
    // Reset the mocked useParams implementation before each test
    ;(useParams as jest.Mock).mockReturnValue({ slug: 'test-slug' })
  })

  it('renders loading state while data is fetching', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Category />
      </MockedProvider>
    )

    // Verify if the loading state is rendered initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
