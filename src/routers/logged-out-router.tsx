import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CreateAccount } from '../pages/signUp'
import { Login } from '../pages/login'
import { NotFound } from '../pages/404'

export const LoggedOut = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
