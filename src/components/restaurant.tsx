import React from 'react'
import { Link } from 'react-router-dom'

interface IRestaurant {
  id: string
  coverImg: string
  name: string
  categoryName?: string
}

export const Restaurant: React.FC<IRestaurant> = ({
  coverImg,
  name,
  categoryName,
  id,
}) => (
  <Link to={`/restaurant/${id}`}>
    <div key={id}>
      <div
        style={{
          backgroundImage: `url(${coverImg})`,
        }}
        className="bg-cover bg-center mb-3 py-32"></div>
      <h3 className="mt-3 text-xl font-bold">{name}</h3>
      <span className="text-sm opacity-50 border-t py-2 mt-4 border-gray-500">
        {categoryName}
      </span>
    </div>
  </Link>
)
