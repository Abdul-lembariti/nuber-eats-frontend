import React from 'react'
// import { isLoggedInVar } from '../apollo'
import { gql, useQuery } from '@apollo/client'
import { meQuery } from '../__generated__/meQuery'
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import { Restaurants } from '../pages/client/restaurants'
import { Header } from '../components/header'

// const ClientRoutes = () => (
// )

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`

export const LoggedIn = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY)
  if (!data || error || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading..</span>
      </div>
    )
  }

  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === 'Client' && (
          <Route path="/" element={<Restaurants />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
