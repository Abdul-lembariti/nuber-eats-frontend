import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, useParams } from 'react-router-dom'; // Import useParams
import { MockedProvider } from '@apollo/client/testing';
import { RESTAURANT_QUERY, Restaurant } from '../restaurant'; // Import the Restaurant component and its query

// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('Restaurant component', () => {
  beforeEach(() => {
    // Reset the mocked useParams implementation before each test
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
  });

  it('renders loading state while data is fetching', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Restaurant />
      </MockedProvider>
    );

    // Verify if the loading state is rendered initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders restaurant details after data fetching', async () => {
    const mockRestaurantQueryResponse = {
      restaurant: {
        ok: true,
        error: null,
        restaurant: {
          __typename: 'Restaurant',
          id: '1',
          name: 'Test Restaurant',
          category: { name: 'Test Category' },
          address: 'Test Address',
          coverImg: 'test-image-url.jpg',
        },
      },
    };

    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: RESTAURANT_QUERY,
              variables: { input: { restaurantId: 1 } },
            },
            result: { data: mockRestaurantQueryResponse },
          },
        ]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/restaurant/1']}>
          <Route path="/restaurant/:id">
            <Restaurant />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for the loading state to disappear
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    // Verify if the restaurant details are rendered
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
  });

  it('renders "No data found" message when no restaurant data is returned', async () => {
    const mockRestaurantQueryResponse = {
      restaurant: {
        ok: false,
        error: 'Restaurant not found',
        restaurant: null,
      },
    };

    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: RESTAURANT_QUERY,
              variables: { input: { restaurantId: 1 } },
            },
            result: { data: mockRestaurantQueryResponse },
          },
        ]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/restaurant/1']}>
          <Route path="/restaurant/:id">
            <Restaurant />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for the loading state to disappear
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

    // Verify if the "No data found" message is rendered
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });
});
