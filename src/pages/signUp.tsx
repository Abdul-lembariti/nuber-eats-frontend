import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../components/form-error'

import nuberLogo from '../Images/logo.svg'
import { Button } from '../components/btn'
import { Link, useNavigate } from 'react-router-dom'
import { UserRole } from '../__generated__/globalTypes'
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation'

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`

interface ICreateAccount {
  email: string
  password: string
  role: UserRole
  resultError?: string
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    formState,
    formState: { errors },
    handleSubmit,
  } = useForm<ICreateAccount>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  })

  const navigate = useNavigate()

  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data

    if (ok) {
      //redirect to login page
      alert('Account Created Successfully! Log In Now')
      navigate('/')
    } else {
      console.log(error)
    }
  }

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  )

  const onSubmit = () => {
    const { email, password, role } = getValues()
    if (!loading) {
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role },
        },
      })
    }
  }

  console.log(watch())
  return (
    <>
      <head>
        <title>CreateAccount || Nuber</title>
      </head>
      <div className="h-screen flex flex-col items-center mt-10 lg:justify-center ">
        <div className="w-full px-5 max-w-screen-sm flex flex-col items-center ">
          <img src={nuberLogo} alt="logo" className="w-60" mb-5 />
          <h4 className="mt-5 font-semibold text-2xl mb-7">Let Get Started</h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-3 mt-5  w-full mb-5">
            <input
              {...register('email', {
                required: 'Email is required',
                pattern:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
              name="email"
              required
              type="email"
              placeholder="Email"
              className="input"
            />
            {errors.email?.message && (
              <FormError errorMessage={errors.email?.message} />
            )}
            {errors.email?.type === 'pattern' && (
              <FormError errorMessage={'Please enter a valid Email'} />
            )}
            <input
              {...register('password', { required: 'Password is required' })}
              required
              name="password"
              type="password"
              placeholder="Password"
              className="input"
            />
            {errors.password?.message && (
              <FormError errorMessage={errors.password?.message} />
            )}
            {errors.password?.type === 'minLength' && (
              <FormError errorMessage="Password must be more than 10 chars." />
            )}
            <select {...register('role', { required: true })} className="input">
              {Object.keys(UserRole).map((role, index) => (
                <option key={index}>{role}</option>
              ))}
            </select>
            <Button
              canClick={formState.isValid}
              loading={loading}
              actionState={'CreateAccount'}
            />
            {createAccountMutationResult?.createAccount.error && (
              <FormError
                errorMessage={createAccountMutationResult.createAccount.error}
              />
            )}
          </form>
          <div>
            Already Have an Account?{' '}
            <Link to="/" className="text-primary hover:underline">
              Log in now
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
