import React from 'react'

interface IFormErrorProps {
  errorMessage: string
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => (
  <span role="alert" className="text-red-600 font-medium">
    {errorMessage}
  </span>
)
