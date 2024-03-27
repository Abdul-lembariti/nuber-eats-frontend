import React from 'react'
// import { isLoggedInVar } from '../apollo'
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import { Restaurants } from '../pages/client/restaurants'
import { Header } from '../components/header'
import { useMe } from '../hooks/useMe'
import { NotFound } from '../pages/404'
import { ConfirmEmail } from '../pages/user/confirm-email'
import { EditProfile } from '../pages/user/edit-profile'
import { Search } from '../pages/client/search'
import { Category } from '../pages/client/category'
import { Restaurant } from '../pages/client/restaurant'
import { MyRestaurants } from '../pages/owner/myRestaurant'
import { AddRestaurant } from '../pages/owner/addRestaurant'
import { MyRestaurant } from '../pages/owner/my-restaurant'

const ClientRoutes = [
  {
    path: '/',
    component: <Restaurants />,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurant/:id',
    component: <Restaurant />,
  },
]

const commonRoutes = [
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
  {
    path: '/confirm',
    component: <ConfirmEmail />,
  },
]

const restaurantRoutes = [
  {
    path: '/',
    component: <MyRestaurants />,
  },
  {
    path: '/add-restaurant',
    component: <AddRestaurant />,
  },
  {
    path: '/restaurant/:id',
    component: <MyRestaurant />,
  },
]

export const LoggedIn = () => {
  const { data, loading, error } = useMe()
  if (!data || error || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading..</span>
      </div>
    )
  }

 /*  const HeaderRoute = () => {
    const location = useLocation()
    return location.pathname !== '/' ? <Header /> : null
  } */

  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === 'Client' &&
          ClientRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}

        {data.me.role === 'Owner' &&
          restaurantRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}

        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
