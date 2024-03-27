import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments'
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated__/myRestaurant'

type IParams = {
  id: string
}

const MY_RESTAURANt = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantPart
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`

export const MyRestaurant = () => {
  const { id } = useParams<IParams>()
  const restaurantId = id ? +id : undefined
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANt,
    {
      variables: {
        input: {
          id: restaurantId ?? 0,
        },
      },
    }
  )
  console.log(data)
  return (
    <div>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading...'}
        </h2>
        <Link
          to={``}
          className="mr-8 text-white bg-gray-800 py-3 px-10 rounded-md">
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-primary py-3 px-3 rounded-md">
          Buy Promotion &rarr;
        </Link>
      </div>
    </div>
  )
}
