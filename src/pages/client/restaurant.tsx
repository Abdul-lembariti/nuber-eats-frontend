import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments'
import { restaurant, restaurantVariables } from '../../__generated__/restaurant'
import { Dish } from '../../components/dish'
import { CreateOrderItemInput } from '../../__generated__/globalTypes'
import { DishOption } from '../../components/dish-option'
import {
  createOrder,
  createOrderVariables,
} from '../../__generated__/createOrder'

export const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
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

const CREATE_ORDER = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
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
  const [orderStart, setStart] = useState(false)
  const [orderItems, setItems] = useState<CreateOrderItemInput[]>([])
  const triggerStartOrder = () => {
    setStart(true)
  }

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId)
  }
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId))
  }
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return
    }
    setItems((current) => [{ dishId, options: [] }, ...current])
  }
  const removeFromOrder = (dishId: number) => {
    setItems((current) => current.filter((dish) => dish.dishId !== dishId))
  }
  const addOptionsToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return
    }
    const oldItem = getItem(dishId)
    if (oldItem) {
      const hasOptions = Boolean(
        oldItem.options?.find((aoption) => aoption.name === optionName)
      )
      if (!hasOptions) {
        removeFromOrder(dishId)
        setItems((current) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ])
      }
    }
  }

  const getOptionsFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName)
  }

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId)
    if (item) {
      return Boolean(getOptionsFromItem(item, optionName))
    }
    return false
  }

  const removeOptionsFromItem = (dishId: number, optionName: string) => {
    if (!isSelected) {
      return
    }

    const oldItem = getItem(dishId)
    if (oldItem) {
      removeFromOrder(dishId)
      setItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
        ...current,
      ])
      return
    }
  }
  const triggerCancel = () => {
    setStart(false)
    setItems([])
  }

  const navigate = useNavigate()
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { orderId },
    } = data
    if (data.createOrder.ok) {
      navigate(`/order/${orderId}`)
    }
  }

  const [createOrder, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER, { onCompleted })
  const confrimOrder = () => {
    if (orderItems.length === 0) {
      alert('Cant place empty order')
      return
    }
    const id = Number(params.id)
    const ok = window.confirm('Your About to Place an Order')
    if (ok && !placingOrder) {
      createOrder({
        variables: {
          input: {
            restaurantId: id,
            items: orderItems,
          },
        },
      })
    }
  }

  return (
    <div>
      <div
        className="bg-gray-600 py-40 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}>
        <div className="bg-white lg:w-1/4 sm:w-3/5 py-3 pl-32">
          <h4 className="text-3xl mb-4">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font- mb-3">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light ">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container pb-32 flex flex-col items-end">
        {!orderStart && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStart && (
          <div className="flex items-center">
            <button onClick={confrimOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancel}
              className="btn px-10 bg-black hover:bg-black">
              Cancel Order
            </button>
          </div>
        )}

        <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10 w-full">
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              isSelected={isSelected(dish.id)}
              id={dish.id}
              orderStarted={orderStart}
              key={index}
              name={dish.name}
              desciption={dish.description}
              price={dish.price}
              photo={dish.photo}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}>
              {dish.options?.map((option, index) => (
                <DishOption
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  dishId={dish.id}
                  addOptionsToItem={addOptionsToItem}
                  removeOptionsFromItem={removeOptionsFromItem}
                  key={index}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  )
}
