import React from 'react'
import nuberLogo from '../Images/logo.svg'
import { useMe } from '../hooks/useMe'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
  const { data } = useMe()
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-600 py-3 px-3 text-center text-white font-bold">
          <span>Please Verify Your Email</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={nuberLogo} alt="logo" className="w-42" />
          </Link>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  )
}
