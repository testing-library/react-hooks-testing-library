import { useState, useRef, useEffect } from 'react'
import { renderHook } from 'src'

describe('async hook tests', () => {
  const useSequence = (...values) => {
    const [first, ...otherValues] = values
    const [value, setValue] = useState(first)
    const index = useRef(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setValue(otherValues[index.current])
        index.current++
      }, 50)
      return () => {
        clearInterval(interval)
      }
    }, [...values])

    return value
  }

  test('should wait for next update', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSequence('first', 'second'))

    expect(result.current).toBe('first')

    await waitForNextUpdate()

    expect(result.current).toBe('second')
  })

  test('should wait for multiple updates', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    await waitForNextUpdate()

    expect(result.current).toBe('second')

    await waitForNextUpdate()

    expect(result.current).toBe('third')
  })

  test('should resolve all when updating', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSequence('first', 'second'))

    expect(result.current).toBe('first')

    await Promise.all([waitForNextUpdate(), waitForNextUpdate(), waitForNextUpdate()])

    expect(result.current).toBe('second')
  })

  test('should reject if timeout exceeded when waiting for next update', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSequence('first', 'second'))

    expect(result.current).toBe('first')

    await expect(waitForNextUpdate({ timeout: 10 })).rejects.toThrow(
      Error('Timed out in waitForNextUpdate after 10ms.')
    )
  })

  test('should wait for expectation to pass', async () => {
    const { result, wait } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    let complete = false
    await wait(() => {
      expect(result.current).toBe('third')
      complete = true
    })
    expect(complete).toBe(true)
  })

  test('should wait for truthy value', async () => {
    const { result, wait } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    await wait(() => result.current === 'third')

    expect(result.current).toBe('third')
  })

  test('should reject if timeout exceeded when waiting for expectation to pass', async () => {
    const { result, wait } = renderHook(() => useSequence('first', 'second', 'third'))

    expect(result.current).toBe('first')

    await expect(
      wait(
        () => {
          expect(result.current).toBe('third')
        },
        { timeout: 75 }
      )
    ).rejects.toThrow(Error('Timed out in wait after 75ms.'))
  })

  test('should wait for value to change', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useSequence('first', 'second', 'third')
    )

    expect(result.current).toBe('first')

    await waitForValueToChange(() => result.current === 'third')

    expect(result.current).toBe('third')
  })

  test('should reject if timeout exceeded when waiting for value to change', async () => {
    const { result, waitForValueToChange } = renderHook(() =>
      useSequence('first', 'second', 'third')
    )

    expect(result.current).toBe('first')

    await expect(
      waitForValueToChange(() => result.current === 'third', {
        timeout: 75
      })
    ).rejects.toThrow(Error('Timed out in waitForValueToChange after 75ms.'))
  })

  test('should reject if selector throws error', async () => {
    const { result, waitForValueToChange } = renderHook(() => useSequence('first', 'second'))

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
})
