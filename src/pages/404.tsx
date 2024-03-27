import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <>
      <head>
        <title>PageNotFound || Nuber</title>
      </head>

      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="font-semibold text-2xl mb-3">Page Not Found..</h2>
        <h4 className="font-medium text-base mb-5">
          The page you're looking for does not exit or has been moved
        </h4>
        <Link to="/" className={'hover:underline text-primary'}>
          Go Back Home &rarr;
        </Link>
      </div>
    </>
  )
}
