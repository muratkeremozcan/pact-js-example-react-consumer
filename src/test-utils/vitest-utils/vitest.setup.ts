import '@testing-library/jest-dom/vitest'
import {cleanup, configure} from '@testing-library/react'
import {afterEach} from 'vitest'
import './msw-setup'

configure({testIdAttribute: 'data-cy'})

// runs a cleanup after each test case
afterEach(() => {
  cleanup()
})
