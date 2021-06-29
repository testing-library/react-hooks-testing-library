import { useState, useCallback } from 'react'

describe('hydration errors tests', () => {
  function useCounter() {
    const [count, setCount] = useState(0)

    const increment = useCallback(() => setCount(count + 1), [count])
    const decrement = useCallback(() => setCount(count - 1), [count])

    return { count, increment, decrement }
  }

  runForRenderers(['server', 'server/pure'], ({ renderHook }) => {
    test('should throw error if component is rehydrated twice in a row', () => {
      const { hydrate } = renderHook(() => useCounter())

      hydrate()

      expect(() => hydrate()).toThrow(Error('The component can only be hydrated once'))
    })

    test('should throw error if component tries to rerender without hydrating', () => {
      const { rerender } = renderHook(() => useCounter())

      expect(() => rerender()).toThrow(
        Error('You must hydrate the component before you can rerender')
      )
    })
  })
})
