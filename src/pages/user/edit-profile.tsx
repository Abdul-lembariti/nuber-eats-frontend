import React from 'react'
import { useMe } from '../../hooks/useMe'
import { Button } from '../../components/btn'
import { useForm } from 'react-hook-form'
import { gql, useApolloClient, useMutation } from '@apollo/client'
import {
  editProfile,
  editProfileVariables,
} from '../../__generated__/editProfile'

const EDIT = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`

interface IForm {
  email?: string
  password?: string
}

//fragment methd which differ from the method used in comfirm
export const EditProfile = () => {
  const { data: userData } = useMe()
  const client = useApolloClient()
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data
    if (ok && userData) {
      const {
        me: { email: prevemail, id },
      } = userData
      const { email: newEmail } = getValues()
      // Update cache
      if (prevemail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        })
      }
    }
  }
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT, {
    onCompleted,
  })
  const { register, handleSubmit, getValues, formState } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  })
  const onSubmit = () => {
    const { email, password } = getValues()
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== '' && { password }),
        },
      },
    })
  }
  return (
    <>
      <head>
        <title>EditProfile || Nuber</title>
      </head>
      <div className="mt-52 flex flex-col justify-center items-center">
        <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
          <input
            {...register('email', {
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            className="input"
            type="email"
            placeholder="Email"
          />
          <input
            {...register('password')}
            name="password"
            className="input"
            type="password"
            placeholder="Password"
          />
          <Button
            loading={loading}
            canClick={formState.isValid}
            actionState={'Update Profile'}
          />
        </form>
      </div>
    </>
  )
}
