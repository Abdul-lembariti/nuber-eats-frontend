import { gql, useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createDish, createDishVariables } from '../../__generated__/createDish'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/btn'
import { MY_RESTAURANt } from './my-restaurant'

const CREATE_DISH = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`

type IParams = {
  restaurantId: string
}

interface IForm {
  name: string
  price: string
  description: string
  [key: string]: string | File
  file: File
}
export const AddDish = () => {
  const { restaurantId } = useParams<IParams>()
  const navigate = useNavigate()
  const id = restaurantId ? +restaurantId : undefined

  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH, {
    refetchQueries: [
      {
        query: MY_RESTAURANt,
        variables: {
          input: {
            id: id,
          },
        },
      },
    ],
  })
  const [imageUrl, setImage] = useState('')
  const { register, handleSubmit, formState, getValues, setValue } =
    useForm<IForm>({
      mode: 'onChange',
    })
  const onSubmit = async () => {
    const { name, price, file, description, ...rest } = getValues()

    let actualFile: File | null = null
    if (file instanceof FileList && file.length > 0) {
      actualFile = file[0]
    }
    let photo = ''
    if (actualFile) {
      const formBody = new FormData()
      formBody.append('file', actualFile)
      const response = await fetch(
        'https://nuber-eats-backendd.onrender.com/uploads',
        {
          method: 'POST',
          body: formBody,
        }
      )
      const { url } = await response.json()
      photo = url
      setImage(url)
    }
    console.log(photo)

    const options = optionsNumber.map((theId) => ({
      name: String(rest[`${theId}-optionName`]),
      extra: +rest[`${theId}-optionExtra`],
    }))
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: id ?? 0,
          options,
          photo: photo,
        },
      },
    })
    navigate(-1)
  }

  const [optionsNumber, setOption] = useState<number[]>([])
  const onAddOptionsClick = () => {
    setOption((current) => [Date.now(), ...current])
  }
  const onDelete = (idToDelete: number) => {
    setOption((current) => current.filter((id) => id !== idToDelete))

    setValue(`${idToDelete}-optionName`, '')
    setValue(`${idToDelete}-optionExtra`, '')
  }
  return (
    <div className="container flex flex-col items-center mt-52">
      <h4 className="font-bold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <input
          className="input"
          type="text"
          {...register('name', { required: 'Name this is required' })}
          name="name"
          placeholder="Name"
        />
        <input
          className="input"
          type="number"
          {...register('price', { required: 'Price this is required' })}
          name="price"
          min={0}
          placeholder="Price"
        />
        <input
          className="input"
          type="text"
          {...register('description', {
            required: 'Description this is required',
          })}
          name="description"
          placeholder="Description"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            {...register('file', { required: true })}
            name="file"
          />
        </div>
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionsClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 ">
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-optionName` as any)}
                  name={`${id}-optionName`}
                  className="py-2 px-4 focus:outline-none mr-3 focus:border-primary border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  {...register(`${id}-optionExtra` as any)}
                  name={`${id}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-primary border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra Price"
                />
                <span
                  className="cursor-pointer text-white bg-red-500 ml-3 py-1 px-4 mt-5 "
                  onClick={() => onDelete(id)}>
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionState="Add Dish"
        />
      </form>
    </div>
  )
}
