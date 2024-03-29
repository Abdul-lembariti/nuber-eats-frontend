import { gql, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from '../../__generated__/restaurantsPageQuery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { Restaurant } from '../../components/restaurant'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { CATEGORY_FRAGMENT } from '../../fragments'

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        address
        isPromoted
        category {
          name
        }
      }
    }
  }
  ${CATEGORY_FRAGMENT}
`

interface IForm {
  searchTerm: string
}

export const Restaurants = () => {
  const [page, setPage] = useState(1)
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  })
  const onNextPage = () => setPage((current) => current + 1)
  const onPrevPage = () => setPage((current) => current - 1)
  const { register, handleSubmit, getValues } = useForm<IForm>()
  const navigate = useNavigate()
  const onSearchSubmit = () => {
    const { searchTerm } = getValues()
    navigate({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    })
  }
  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit(onSearchSubmit)}
          className="bg-gray-800 w-full py-36 flex items-center justify-center">
          <div className="relative sm:w-1/2 lg:w-3/12">
            <input
              {...register('searchTerm', { required: true, min: 3 })}
              name="searchTerm"
              type="search"
              className="input w-full rounded-lg pl-10 "
              placeholder="Search Restaurant"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faSearch} className="text-primary" />
            </div>
          </div>
        </form>
        {!loading && (
          <div className="max-w-screen-xl mx-auto mt-8 pb-20 ">
            <div className="flex justify-around max-w-xl mx-auto mb-7">
              {data?.allCategories.categories?.map((category) => (
                <Link to={`/category/${category.slug}`}>
                  <div
                    key={category.id}
                    className="flex flex-col items-center cursor-pointer">
                    <div
                      className="w-14 h-14 bg-cover rounded-full transform hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${category.coverImg})`,
                      }}></div>
                    <span className="text-sm font-bold">{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-x-5 gap-y-10">
              {data?.restaurants.results?.map((restaurant) => (
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ''}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              ))}
            </div>
            <div className="grid md:grid-cols-3 max-w-md mx-auto  text-center items-center mt-10">
              {page > 1 ? (
                <button
                  onClick={onPrevPage}
                  className=" focus:outline-none font-medium text-2xl">
                  <FontAwesomeIcon
                    className="text-primary text-lg font-bold"
                    icon={faChevronCircleLeft}
                  />
                </button>
              ) : (
                <div></div>
              )}

              <span className="mx-5">
                Page: {page} of {data?.restaurants.totalPages}
              </span>
              {page !== data?.restaurants.totalPages ? (
                <button
                  onClick={onNextPage}
                  className=" focus:outline-none font-medium text-2xl">
                  <FontAwesomeIcon
                    className="text-primary text-lg font-bold"
                    icon={faChevronCircleRight}
                  />
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
