/* eslint-disable testing-library/no-node-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable testing-library/prefer-screen-queries */
import { render } from '@testing-library/react'
import React from 'react'
import { Button } from '../btn'

describe('<Button/>', () => {
  it('should render ok with props', () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionState={'test'} />
    )
    getByText('test')
  })

  it('should display loading', () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionState={'test'} />
    )
    getByText('Loading...')
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })
})
