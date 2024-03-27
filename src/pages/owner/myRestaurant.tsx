import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { RESTAURANT_FRAGMENT } from '../../fragments'
import { myRestaurants } from '../../__generated__/myRestaurants'
import { Link } from 'react-router-dom'
import { Restaurant } from '../../components/restaurant'

export const MY_RESTAURANTS = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantPart
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS)
  return (
    <div className="max-w-screen-xl mx-auto mt-32">
      <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
      {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
        <>
          <h4 className="text-xl mb-5">You Dont Have Any Restaurants.</h4>
          <Link to="/add-restaurant" className="text-primary hover:underline">
            Create One &rarr;
          </Link>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-x-5 gap-y-10">
          {data?.myRestaurants.restaurants.map((restaurant) => (
            <ul>
              <li>
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ''}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              </li>
            </ul>
          ))}
        </div>
      )}
    </div>
  )
}
