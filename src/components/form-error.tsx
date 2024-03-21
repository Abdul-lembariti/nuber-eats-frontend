import React from 'react'

interface IError {
  errorMessage: string
}

export const FormError: React.FC<IError> = ({ errorMessage }) => (
  <span className="text-red-600 font-medium">{errorMessage}</span>
)
