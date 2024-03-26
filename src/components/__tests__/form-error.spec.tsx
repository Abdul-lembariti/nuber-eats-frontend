import { render } from '@testing-library/react'
import { FormError } from '../form-error'

describe('<formError/>', () => {
  it('renders ok with props', () => {
    const { getByText } = render(<FormError errorMessage="test" />)
    getByText('test')
  })
})
