import { gql, useApolloClient, useMutation } from '@apollo/client'
import React, { useEffect } from 'react'
import {
  verifyEmail,
  verifyEmailVariables,
} from '../../__generated__/verifyEmail'
import { useMe } from '../../hooks/useMe'
import { useNavigate } from 'react-router-dom'

const VERIFY = gql`
  mutation verifyEmail($input: VerifyEmailInPut!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`

export const ConfirmEmail = () => {
  const { data: userData } = useMe()
  const client = useApolloClient()
  const navigate = useNavigate()
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      })
      navigate('/')
    }
  }
  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(VERIFY, {
    onCompleted,
  })

  useEffect(() => {
    const [_, code] = window.location.href.split('code=')
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    })
  }, [])
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-2 font-medium">Confirming Email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait dont Close this page
      </h4>
    </div>
  )
}
