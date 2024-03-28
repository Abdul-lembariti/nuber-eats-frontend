import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments'
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated__/myRestaurant'
import { Dish } from '../../components/dish'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory'

type IParams = {
  id: string
}

export const MY_RESTAURANt = gql`
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


  const chartData = [
    { x: 1, y: 3000 },
    { x: 2, y: 1500 },
    { x: 3, y: 4250 },
    { x: 4, y: 1250 },
    { x: 5, y: 2300 },
    { x: 6, y: 7150 },
    { x: 7, y: 6830 },
    { x: 8, y: 6830 },
    { x: 9, y: 6830 },
    { x: 10, y: 6830 },
    { x: 11, y: 6830 },
  ];



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
          to={`/restaurant/${id}/add-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10 rounded-md">
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-primary py-3 px-3 rounded-md">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="font-bold">Please Upload a Dish</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  name={dish.name}
                  desciption={dish.description}
                  price={dish.price}
                  photo={dish.photo}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="max-w-lg w-full mx-auto">
            <VictoryChart domainPadding={20}>
              <VictoryAxis
                label="Amount of sales"
                dependentAxis
                tickValues={[20, 30, 40, 50, 60]}
              />
              <VictoryAxis label="Days of sales" />
              <VictoryBar
                data={[
                  { x: 10, y: 20 },
                  { x: 20, y: 10 },
                  { x: 30, y: 55 },
                  { x: 40, y: 99 },
                ]}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  )
}
