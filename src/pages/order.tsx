import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOrder, getOrderVariables } from '../__generated__/getOrder'
import { FULL_ORDER_FRAGMENT } from '../fragments'
import {
  orderUpdates,
  orderUpdatesVariables,
} from '../__generated__/orderUpdates'
import { useMe } from '../hooks/useMe'
import { editOrder, editOrderVariables } from '../__generated__/editOrder'
import { OrderStatus, UserRole } from '../__generated__/globalTypes'

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdateInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`

type IParams = {
  id: string
}

export const Order = () => {
  const params = useParams<IParams>()
  const { data: userData } = useMe()
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(
    EDIT_ORDER
  )
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: Number(params.id),
        },
      },
    }
  )

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: Number(params.id),
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          }
        },
      })
    }
  }, [data])

  //subscription does not work as in backend this means cant work in real time needs an refresh

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: Number(params.id),
          status: newStatus,
        },
      },
    })
  }

  return (
    <div className="mt-32 container flex justify-center">
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{' '}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700">
            Deliver To:{''}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{''}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || 'Not Yet'}
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className="text-center mt-5 mb-3 text-2xl text-primary">
              Status:{data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn">
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn">
                  Order Cooked
                </button>
              )}

              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className="text-center mt-5 mb-3 text-2xl text-primary">
                    Status:{data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}

          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className="btn">
                  Picked Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className="btn">
                  Order Deliverd
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className="text-center mt-5 mb-3 text-2xl text-primary">
              Thank you for your using NUBER EATS
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
