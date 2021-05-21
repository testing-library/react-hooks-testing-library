import { useEffect } from 'react'

import { ReactHooksServerRenderer } from '../../types/react'

// This verifies that if process.env is unavailable
// then we still auto-wire up the afterEach for folks
describe('skip auto cleanup (no process.env) tests', () => {
  const originalEnv = process.env
  const cleanups: Record<string, boolean> = {
    ssr: false,
    hydrated: false
  }
  let renderHook: ReactHooksServerRenderer['renderHook']

  beforeAll(() => {
    process.env = {
      ...process.env,
      get RHTL_SKIP_AUTO_CLEANUP(): string | undefined {
        throw new Error('expected')
      }
    }
    renderHook = (require('..') as ReactHooksServerRenderer).renderHook
  })

  afterAll(() => {
    process.env = originalEnv
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
    expect(cleanups.hydrated).toBe(true)
  })
})
