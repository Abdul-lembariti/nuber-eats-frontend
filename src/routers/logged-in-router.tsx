import React from 'react'
// import { isLoggedInVar } from '../apollo'
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom'
import { Restaurants } from '../pages/client/restaurants'
import { Header } from '../components/header'
import { useMe } from '../hooks/useMe'
import { NotFound } from '../pages/404'
import { ConfirmEmail } from '../pages/user/confirm-email'
import { EditProfile } from '../pages/user/edit-profile'

// const ClientRoutes = () => (
// )

export const LoggedIn = () => {
  const { data, loading, error } = useMe()
  if (!data || error || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading..</span>
      </div>
    )
  }

  const HeaderRoute = () => {
    const location = useLocation()
    return location.pathname !== '/' ? <Header /> : null
  }

  return (
    <Router>
      <HeaderRoute />
      <Routes>
        {data.me.role === 'Client' && (
          <>
            <Route path="/" element={<Restaurants />} />
            <Route path="/confirm" element={<ConfirmEmail />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
