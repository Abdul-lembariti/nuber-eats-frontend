import React from 'react'

interface IDishProp {
  isSelected: boolean
  name: string
  extra?: number | null
  dishId: number
  addOptionsToItem: (dishId: number, optionName: string) => void
  removeOptionsFromItem: (dishId: number, optionName: string) => void
}

export const DishOption: React.FC<IDishProp> = ({
  isSelected,
  name,
  extra,
  dishId,
  addOptionsToItem,
  removeOptionsFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionsFromItem(dishId, name)
    } else {
      addOptionsToItem(dishId, name)
    }
  }
  return (
    <span
      onClick={onClick}
      className={`flex border items-center ${
        isSelected ? 'border-primary' : ''
      }`}>
      <h6 className="mr-3">{name}</h6>
      {extra && <h6 className="text-sm opacity-75">(${extra})</h6>}
    </span>
  )
}
