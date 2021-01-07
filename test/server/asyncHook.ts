import { useState, useRef, useEffect } from 'react'

import { renderHook } from '../../src/server'

describe('async hook tests', () => {
  const useSequence = (...values: string[]) => {
    const [first, ...otherValues] = values
    const [value, setValue] = useState(first)
    const index = useRef(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setValue(otherValues[index.current++])
        if (index.current === otherValues.length) {
          clearInterval(interval)
        }
      }, 50)
      return () => {
        clearInterval(interval)
      }
    }, [otherValues])

    return value
  }

  test('should wait for next update', async () => {
    const { result, hydrate, waitForNextUpdate } = renderHook(() => useSequence('first', 'second'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await waitForNextUpdate()

    expect(result.current).toBe('second')
  })

  test('should wait for multiple updates', async () => {
    const { result, hydrate, waitForNextUpdate } = renderHook(() =>
      useSequence('first', 'second', 'third')
    )

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await waitForNextUpdate()

    expect(result.current).toBe('second')

    await waitForNextUpdate()

    expect(result.current).toBe('third')
  })

  test('should resolve all when updating', async () => {
    const { result, hydrate, waitForNextUpdate } = renderHook(() => useSequence('first', 'second'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await Promise.all([waitForNextUpdate(), waitForNextUpdate(), waitForNextUpdate()])

    expect(result.current).toBe('second')
  })

  test('should reject if timeout exceeded when waiting for next update', async () => {
    const { result, hydrate, waitForNextUpdate } = renderHook(() => useSequence('first', 'second'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await expect(waitForNextUpdate({ timeout: 10 })).rejects.toThrow(
      Error('Timed out in waitForNextUpdate after 10ms.')
    )
  })

  test('should wait for expectation to pass', async () => {
    const { result, hydrate, waitFor } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    let complete = false
    await waitFor(() => {
      expect(result.current).toBe('third')
      complete = true
    })
    expect(complete).toBe(true)
  })

  test('should wait for arbitrary expectation to pass', async () => {
    const { waitFor, hydrate } = renderHook(() => null)

    hydrate()

    let actual = 0
    const expected = 1

    setTimeout(() => {
      actual = expected
    }, 200)

    let complete = false
    await waitFor(
      () => {
        expect(actual).toBe(expected)
        complete = true
      },
      { interval: 100 }
    )

    expect(complete).toBe(true)
  })

  test('should not hang if expectation is already passing', async () => {
    const { result, hydrate, waitFor } = renderHook(() => useSequence('first', 'second'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    let complete = false
    await waitFor(() => {
      expect(result.current).toBe('first')
      complete = true
    })
    expect(complete).toBe(true)
  })

  test('should reject if callback throws error', async () => {
    const { result, hydrate, waitFor } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await expect(
      waitFor(
        () => {
          if (result.current === 'second') {
            throw new Error('Something Unexpected')
          }
          return result.current === 'third'
        },
        {
          suppressErrors: false
        }
      )
    ).rejects.toThrow(Error('Something Unexpected'))
  })

  test('should reject if callback immediately throws error', async () => {
    const { result, hydrate, waitFor } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await expect(
      waitFor(
        () => {
          throw new Error('Something Unexpected')
        },
        {
          suppressErrors: false
        }
      )
    ).rejects.toThrow(Error('Something Unexpected'))
  })

  test('should wait for truthy value', async () => {
    const { result, hydrate, waitFor } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await waitFor(() => result.current === 'third')

    expect(result.current).toBe('third')
  })

  test('should reject if timeout exceeded when waiting for expectation to pass', async () => {
    const { result, hydrate, waitFor } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await expect(
      waitFor(
        () => {
          expect(result.current).toBe('third')
        },
        { timeout: 75 }
      )
    ).rejects.toThrow(Error('Timed out in waitFor after 75ms.'))
  })

  test('should wait for value to change', async () => {
    const { result, hydrate, waitForValueToChange } = renderHook(() =>
      useSequence('first', 'second', 'third')
    )

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await waitForValueToChange(() => result.current === 'third')

    expect(result.current).toBe('third')
  })

  test('should reject if timeout exceeded when waiting for value to change', async () => {
    const { result, hydrate, waitForValueToChange } = renderHook(() =>
      useSequence('first', 'second', 'third')
    )

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await expect(
      waitForValueToChange(() => result.current === 'third', {
        timeout: 75
      })
    ).rejects.toThrow(Error('Timed out in waitForValueToChange after 75ms.'))
  })

  test('should reject if selector throws error', async () => {
    const { result, hydrate, waitForValueToChange } = renderHook(() =>
      useSequence('first', 'second')
    )

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await expect(
      waitForValueToChange(() => {
        if (result.current === 'second') {
          throw new Error('Something Unexpected')
        }
        return result.current
      })
    ).rejects.toThrow(Error('Something Unexpected'))
  })

  test('should not reject if selector throws error and suppress errors option is enabled', async () => {
    const { result, hydrate, waitForValueToChange } = renderHook(() =>
      useSequence('first', 'second', 'third')
    )

    expect(result.current).toBe('first')

    hydrate()

    expect(result.current).toBe('first')

    await waitForValueToChange(
      () => {
        if (result.current === 'second') {
          throw new Error('Something Unexpected')
        }
        return result.current === 'third'
      },
      { suppressErrors: true }
    )

    expect(result.current).toBe('third')
  })
})
