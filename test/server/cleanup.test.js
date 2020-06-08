import { useEffect } from 'react'
import { renderHook, cleanup } from 'src/server'

describe('cleanup tests', () => {
  test('should flush effects on cleanup', async () => {
    let cleanupCalled = false

    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          cleanupCalled = true
        }
      })
    }

    const { hydrate } = renderHook(() => hookWithCleanup())

    hydrate()

    await cleanup()

    expect(cleanupCalled).toBe(true)
  })

  test('should cleanup all rendered hooks', async () => {
    let cleanupCalled = []
    const hookWithCleanup = (id) => {
      useEffect(() => {
        return () => {
          cleanupCalled[id] = true
        }
      })
    }

    const { hydrate: hydrate1 } = renderHook(() => hookWithCleanup(1))
    const { hydrate: hydrate2 } = renderHook(() => hookWithCleanup(2))

    hydrate1()
    hydrate2()

    await cleanup()

    expect(cleanupCalled[1]).toBe(true)
    expect(cleanupCalled[2]).toBe(true)
  })

  test('should only cleanup hydrated hooks', async () => {
    let cleanupCalled = [false, false]
    const hookWithCleanup = (id) => {
      useEffect(() => {
        return () => {
          cleanupCalled[id] = true
        }
      })
    }

    renderHook(() => hookWithCleanup(1))
    const { hydrate } = renderHook(() => hookWithCleanup(2))

    hydrate()

    await cleanup()

    expect(cleanupCalled[1]).toBe(false)
    expect(cleanupCalled[2]).toBe(true)
  })
})
