import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments'
import { category, categoryVariables } from '../../__generated__/category'

export const CATEGORYQUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      restaurants {
        ...RestaurantPart
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`

type ICategoryParams = {
  slug?: string
}

export const Category = () => {
  const params = useParams<ICategoryParams>()
  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORYQUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug ?? '',
        },
      },
    }
  )

  if (loading) return <div>Loading...</div>

  if (!data?.category || !data.category.category)
    return <div>No data found</div>

  return (
    <div>
      <div
        className="bg-gray-600 py-40 bg-cover bg-centers bg-no-repeat"
        style={{
          backgroundImage: `url(${data.category.category.coverImg})`,
        }}>
        <div className="bg-white w-3/12 py-3 pl-32">
          Name: <h4 className="text-3xl mb-4">{data.category.category.name}</h4>
        </div>
      </div>
    </div>
  )
}
