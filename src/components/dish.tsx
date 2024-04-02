import React from 'react'
import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant'

interface IDish {
  id?: number
  desciption: string
  price: number
  name: string
  photo: string | null
  isCustomer?: boolean
  orderStarted?: boolean
  options?: restaurant_restaurant_restaurant_menu_options[] | null
  addItemToOrder?: (dishId: number) => void
  removeFromOrder?: (dishId: number) => void
  isSelected?: boolean
  children?: React.ReactNode
}

export const Dish: React.FC<IDish> = ({
  id = 0,
  desciption,
  price,
  name,
  photo,
  isCustomer = false,
  options,
  orderStarted = false,
  addItemToOrder,
  isSelected,
  removeFromOrder,
  children: dishOptions,
}) => {
  // console.log(options)
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id)
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id)
      }
    }
  }
  return (
    <div
      className={`p-2 border  mb-7 hover:scale-105 transition-transform ${
        isSelected ? 'border-primary' : 'border-none'
      }`}>
      <div
        className="bg-gray-700 py-24 bg-center bg-cover"
        style={{
          backgroundImage: `url(${photo})`,
        }}></div>
      <div className="flex flex-col p-2">
        <h2 className="text-4xl font-medium">
          {name}{' '}
          {orderStarted && (
            <button onClick={onClick}>
              {isSelected ? 'Remove Order' : 'Add Order'}
            </button>
          )}
        </h2>
        <div className="flex justify-between mt-3 border-b-2 border-gray-400">
          <span className="text-[15px] font-bold">{desciption}</span>
          <h4 className="text-gray-700">Price: ${price}</h4>
        </div>
        {isCustomer && options && options?.length !== 0 && (
          <div>
            <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
            {dishOptions}
          </div>
        )}
      </div>
    </div>
  )
}
