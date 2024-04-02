import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
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
import { initializePaddle, Paddle, PaddleEventData } from '@paddle/paddle-js'
import { useMe } from '../../hooks/useMe'
import {
  createPayment,
  createPaymentVariables,
} from '../../__generated__/createPayment'
import { pendingOrders } from '../../__generated__/pendingOrders'

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

const PENDING_ORDER = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
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

  const [createPayment, { loading }] = useMutation<
    createPayment,
    createPaymentVariables
  >(CREATE_PAYMENT)

  useEffect(() => {
    initializePaddle({
      environment: 'sandbox',
      token: 'test_7d3ecdbd9d91986cea0cd5a9ab1',
      eventCallback: function (data: PaddleEventData) {
        const transactionId = data?.data?.transaction_id
        if (transactionId) {
          createPayment({
            variables: {
              input: {
                transactionId: transactionId,
                restaurantId: restaurantId ?? 0,
              },
            },
          }).then((result) => {
            if (result.data?.createPayment.ok) {
              alert('Your about to be promoted')
            } else {
              console.error('Payment failed:', result.data?.createPayment.error)
            }
          })
        }
      },
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
      paddle?.Checkout.open({
        items: [{ priceId: 'pri_01ht4pje32da7g6mnpp39c56yw', quantity: 1 }],
        customer: { email: userData?.me.email ?? '' },
      })
    } else {
      console.error('Paddle is not initialized yet.')
    }
  }

  const { data: subData } = useSubscription<pendingOrders>(PENDING_ORDER)
  const navigate = useNavigate()
  console.log(subData)
  //cant redirect the user due to subscriptions
  useEffect(() => {
    if (subData && subData.pendingOrders && subData.pendingOrders.id) {
      navigate(`/order/${subData.pendingOrders.id}`)
    }
  }, [subData, navigate])

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
                //@ts-ignore
                tickFormat={(tick) => new Date(tick).toLocaleDateString('tz')}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  )
}
