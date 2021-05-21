import { useEffect } from 'react'

import { ReactHooksServerRenderer } from '../../types/react'

// This verifies that if afterEach is unavailable
// then we DON'T auto-wire up the afterEach for folks
describe('skip auto cleanup (no afterEach) tests', () => {
  const cleanups: Record<string, boolean> = {
    ssr: false,
    hydrated: false
  }
  let renderHook: ReactHooksServerRenderer['renderHook']

  beforeAll(() => {
    // @ts-expect-error Turning off AfterEach -- ignore Jest LifeCycle Type
    afterEach = false
    renderHook = (require('..') as ReactHooksServerRenderer).renderHook
  })

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
