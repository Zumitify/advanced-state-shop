// Adds custom jest-dom matchers (toBeInTheDocument, toBeDisabled, ...) and
// cleans up the DOM between tests.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
