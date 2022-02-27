/**
 * @jest-environment node
 */
import { useState } from 'react'

// This verifies that renderHook can be called in
// a SSR-like environment.
describe('renderHook', () => {
  function useLoading() {
    const [loading, setLoading] = useState(false)
    return { loading, setLoading }
  }
  runForRenderers(['server'], ({ renderHook }) => {
    test('should not throw in SSR environment', () => {
      expect(() => renderHook(() => useLoading())).not.toThrowError('document is not defined')
    })
  })
})
