import { useEffect } from 'react'
import { renderHook } from '../pure'

// This verifies that if pure imports are used
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (pure) tests', () => {
  const cleanups: Record<string, boolean> = {
    ssr: false,
    hydrated: false
  }

  test('first', () => {
    const hookWithCleanup = (name: string) => {
      useEffect(() => {
        return () => {
          cleanups[name] = true
        }
      })
    }

    renderHook(() => hookWithCleanup('ssr'))

    const { hydrate } = renderHook(() => hookWithCleanup('hydrated'))
    hydrate()
  })

  test('second', () => {
    expect(cleanups.ssr).toBe(false)
    expect(cleanups.hydrated).toBe(false)
  })
})
