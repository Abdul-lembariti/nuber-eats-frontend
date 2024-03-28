import { gql, useApolloClient, useMutation } from '@apollo/client'
import React, { useState } from 'react'
import {
  createRestaurant,
  createRestaurantVariables,
} from '../../__generated__/createRestaurant'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/btn'
import { FormError } from '../../components/form-error'
import { MY_RESTAURANTS } from './myRestaurant'
import { useNavigate } from 'react-router-dom'

export const CREATE_RESTURANT = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`

interface IForm {
  name: string
  address: string
  categoryName: string
  file: FileList
}

export const AddRestaurant = () => {
  const client = useApolloClient()
  const navigate = useNavigate()
  const [imageUrl, setImage] = useState('')
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data
    if (ok) {
      const { name, categoryName, address } = getValues()
      setUploading(false)
      const queryResult = client.readQuery({ query: MY_RESTAURANTS })

      client.writeQuery({
        query: MY_RESTAURANTS,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: 'Category',
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: 'Restaurant',
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      })
      navigate('/')
    }
  }

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTURANT, {
    onCompleted,
    refetchQueries: [{ query: MY_RESTAURANTS }],
  })

  const { register, getValues, formState, handleSubmit } = useForm<IForm>({
    mode: 'onChange',
  })

  const [uploading, setUploading] = useState(false)

  const onSubmit = async () => {
    try {
      setUploading(true)
      const { file, name, categoryName, address } = getValues()
      const actualFile = file[0]
      const formBody = new FormData()

      formBody.append('file', actualFile)
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads', {
          method: 'POST',
          body: formBody,
        })
      ).json()
      setImage(coverImg)
      
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      })
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div className="container flex flex-col items-center mt-32">
      <h1>Add Restaurant</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-xl gap-3 mt-5 w-full mb-5">
        <input
          className="input"
          type="text"
          {...register('name', { required: 'Name this is required' })}
          name="name"
          placeholder="Name"
        />
        <input
          className="input"
          type="text"
          {...register('address', { required: 'Address this is required' })}
          name="address"
          placeholder="Address"
        />
        <input
          className="input"
          type="text"
          {...register('categoryName', {
            required: 'CategoryName this is required',
          })}
          name="categoryName"
          placeholder="CategoryName"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            {...register('file', { required: true })}
            name="file"
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionState="Add Restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  )
}
