import React from 'react'
interface IBtn {
  canClick: Boolean
  loading: Boolean
  actionState: String
}

export const Button: React.FC<IBtn> = ({ canClick, actionState, loading }) => (
  <button
    className={`mt-3 text-lg focus:outline-none font-medium rounded-lg text-white py-5  transition-colors ${
      canClick
        ? 'bg-primary hover:bg-lime-600'
        : 'bg-gray-400 pointer-events-none'
    }`}>
    {loading ? 'Loading...' : actionState}
  </button>
)
