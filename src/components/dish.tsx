import React from 'react'

interface IDish {
  desciption: string
  price: number
  name: string
  photo: string | null
}

export const Dish: React.FC<IDish> = ({ desciption, price, name, photo }) => {
  return (
    <div className="p-2 border border-primary mb-7 hover:scale-105 transition-transform">
      <div
        className="bg-gray-700 py-24 bg-center bg-cover"
        style={{
          backgroundImage: `url(${photo})`,
        }}></div>
      <div className="grid gap-1 grid-cols-2">
        <h2 className="text-4xl font-medium">{name}</h2>
        <div>
          <h4 className="text-[15px] font-bold">{desciption}</h4>
          <h4 className="text-gray-700">${price}</h4>
        </div>
      </div>
    </div>
  )
}
