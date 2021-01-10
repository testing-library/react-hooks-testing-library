import { useEffect } from 'react'
import { renderHook, cleanup, addCleanup, removeCleanup } from '../pure'

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

    renderHook(() => hookWithCleanup())

    await cleanup()

    expect(cleanupCalled).toBe(true)
  })

  test('should cleanup all rendered hooks', async () => {
    const cleanupCalled: boolean[] = []
    const hookWithCleanup = (id: number) => {
      useEffect(() => {
        return () => {
          cleanupCalled[id] = true
        }
      })
    }

    renderHook(() => hookWithCleanup(1))
    renderHook(() => hookWithCleanup(2))

    await cleanup()

    expect(cleanupCalled[1]).toBe(true)
    expect(cleanupCalled[2]).toBe(true)
  })

  test('should call cleanups in reverse order', async () => {
    const callSequence: string[] = []
    addCleanup(() => {
      callSequence.push('cleanup')
    })
    addCleanup(() => {
      callSequence.push('another cleanup')
    })
    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          callSequence.push('unmount')
        }
      })
    }
    renderHook(() => hookWithCleanup())

    await cleanup()

    expect(callSequence).toEqual(['unmount', 'another cleanup', 'cleanup'])
  })

  test('should wait for async cleanup', async () => {
    const callSequence: string[] = []
    addCleanup(() => {
      callSequence.push('cleanup')
    })
    addCleanup(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      callSequence.push('another cleanup')
    })
    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          callSequence.push('unmount')
        }
      })
    }
    renderHook(() => hookWithCleanup())

    await cleanup()

    expect(callSequence).toEqual(['unmount', 'another cleanup', 'cleanup'])
  })

  test('should remove cleanup using removeCleanup', async () => {
    const callSequence: string[] = []
    addCleanup(() => {
      callSequence.push('cleanup')
    })
    const anotherCleanup = () => {
      callSequence.push('another cleanup')
    }
    addCleanup(anotherCleanup)
    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          callSequence.push('unmount')
        }
      })
    }
    renderHook(() => hookWithCleanup())

    removeCleanup(anotherCleanup)

    await cleanup()

    expect(callSequence).toEqual(['unmount', 'cleanup'])
  })

  test('should remove cleanup using returned handler', async () => {
    const callSequence: string[] = []
    addCleanup(() => {
      callSequence.push('cleanup')
    })
    const remove = addCleanup(() => {
      callSequence.push('another cleanup')
    })
    const hookWithCleanup = () => {
      useEffect(() => {
        return () => {
          callSequence.push('unmount')
        }
      })
    }
    renderHook(() => hookWithCleanup())

    remove()

    await cleanup()

    expect(callSequence).toEqual(['unmount', 'cleanup'])
  })
})
