import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CreateAccount } from '../pages/signUp'
import { Login } from '../pages/login'

export const LoggedOut = () => {
  return (
    <Router>
      <Routes>
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  )
}
