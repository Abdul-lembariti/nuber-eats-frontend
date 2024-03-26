import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { useParams } from 'react-router-dom'
import { RESTAURANT_FRAGMENT } from '../../fragments'
import { restaurant, restaurantVariables } from '../../__generated__/restaurant'

export const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`

type IRestaurant = {
  id: string
}

export const Restaurant = () => {
  const params = useParams<IRestaurant>()
  const restaurantId = Number(params.id)

  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId,
      },
    },
  })
  console.log(data)
  return (
    <div>
      <div
        className="bg-gray-600 py-40 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}>
        <div className="bg-white w-3/12 py-3 pl-32">
          <h4 className="text-3xl mb-4">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font- mb-3">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light ">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
    </div>
  )
}
