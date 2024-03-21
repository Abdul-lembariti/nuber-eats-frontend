import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../components/form-error'
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation'
import nuberLogo from '../Images/logo.svg'
import { Button } from '../components/btn'
import { Link } from 'react-router-dom'
import { authToken, isLoggedInVar } from '../apollo'
import { LOCALSTORAGE } from '../constants'

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`

interface ILoginForm {
  email: string
  password: string
  resultError?: string
}

export const Login = () => {
  const {
    register,
    getValues,
    formState,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  })
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE, token)
      authToken(token)
      isLoggedInVar(true)
    }
  }
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  })
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues()
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      })
    }
  }
  return (
    <>
      <head>
        <title>Login || Nuber</title>
      </head>
      <div className="h-screen flex flex-col items-center mt-10 lg:justify-center ">
        <div className="w-full px-5 max-w-screen-sm flex flex-col items-center ">
          <img src={nuberLogo} alt="logo" className="w-60" mb-5 />
          <h4 className="mt-5 font-semibold text-2xl mb-7">Welcome Back</h4>
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
            <Button
              canClick={formState.isValid}
              loading={loading}
              actionState={'LogIn'}
            />
            {loginMutationResult?.login.error && (
              <FormError errorMessage={loginMutationResult.login.error} />
            )}
          </form>
          <div>
            New to Nuber?{' '}
            <Link to="/create-account" className="text-primary hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
