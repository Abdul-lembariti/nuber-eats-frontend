import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  DISH_FRAGMENT,
  ORDER_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from '../../fragments'
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated__/myRestaurant'
import { Dish } from '../../components/dish'
import {
  VictoryAxis,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryChart,
  VictoryLabel,
} from 'victory'
import { initializePaddle, Paddle } from '@paddle/paddle-js'
import { useMe } from '../../hooks/useMe'
import {
  createPayment,
  createPaymentVariables,
} from '../../__generated__/createPayment'

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
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`

const CREATE_PAYMENT = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`

export const MyRestaurant = () => {
  const [paddle, setPaddle] = useState<Paddle>()
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
  const onCompleted = (data: createPayment) => {
    if (data.createPayment.ok) {
      alert('Your restaurant has been promted')
    }
  }

  const [createPayment, { loading }] = useMutation<
    createPayment,
    createPaymentVariables
  >(CREATE_PAYMENT, {
    onCompleted,
  })

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: 'test_7d3ecdbd9d91986cea0cd5a9ab1',
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance)
      }
    })
  }, [])

  const { data: userData } = useMe()
  //@ts-ignore
  const triggerPaddle = () => {
    if (paddle) {
      const checkoutData = paddle?.Checkout.open({
        items: [{ priceId: 'pri_01ht4pje32da7g6mnpp39c56yw', quantity: 1 }],
        customer: { email: userData?.me.email ?? '' },
      })
      console.log(checkoutData)
      createPayment({
        variables: {
          input: {
            transactionId: '12',
            restaurantId: restaurantId ?? 0,
          },
        },
      })
    } else {
      console.error('Paddle is not initialized yet.')
    }
  }

  return (
    <div>
      <head>
        <title>My-Restaurant</title>
      </head>
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
        <span
          onClick={triggerPaddle}
          className="cursor-pointer text-white bg-primary py-3 px-3 rounded-md">
          Buy Promotion &rarr;
        </span>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="font-bold">Please Upload a Dish</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish, index) => (
                <Dish
                  key={index}
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
          <div className=" mt-10">
            <VictoryChart
              height={500}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}>
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 18 }}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 18,
                    angle: 45,
                  },
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString('tz')}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  )
}
