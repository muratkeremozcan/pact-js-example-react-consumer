import '@testing-library/jest-dom/vitest'
import '@testing-library/jest-dom'
import {cleanup, configure} from '@testing-library/react'
import {afterEach} from 'vitest'

configure({testIdAttribute: 'data-cy'})

// runs a cleanup after each test case
afterEach(() => {
  cleanup()
})
