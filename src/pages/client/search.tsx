import { gql, useLazyQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RESTAURANT_FRAGMENT } from '../../fragments'
import {
  searchRestaurant,
  searchRestaurantVariables,
} from '../../__generated__/searchRestaurant'

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`

export const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [fetch, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT)

  useEffect(() => {
    const [_, query] = location.search.split('?term=')
    if (!query) {
      navigate('/')
    }
    fetch({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    })
  }, [navigate, location])
  console.log(loading, data, called)
  return <h1>Search Page</h1>
}
