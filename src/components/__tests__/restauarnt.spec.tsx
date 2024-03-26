import { render } from '@testing-library/react'
import { Restaurant } from '../restaurant'
import { BrowserRouter as Router } from 'react-router-dom'

describe('<Restaurnat />', () => {
  it('renders OK with props', () => {
    const { container, getByText } = render(
      <Router>
        <Restaurant id="1" coverImg="we" name="test" categoryName="catTest" />
      </Router>
    )
    getByText('test')
    getByText('catTest')
    expect(container.firstChild).toHaveAttribute('href', '/restaurant/1')
  })
})
