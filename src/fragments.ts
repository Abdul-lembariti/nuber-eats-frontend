import { gql } from '@apollo/client'

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantPart on Restaurant {
    id
    name
    coverImg
    address
    isPromoted
    category {
      name
    }
  }
`

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`

export const DISH_FRAGMENT = gql`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`
