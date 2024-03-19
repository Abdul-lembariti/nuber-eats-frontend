import React from 'react'
import { LoggedOut } from './routers/logged-out-router'
import { useReactiveVar } from '@apollo/client'
import { LoggedIn } from './routers/logged-in-router'
import { isLoggedInVar } from './apollo'

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  return isLoggedIn ? <LoggedIn /> : <LoggedOut />
}

export default App
