import { useState, useEffect } from 'react'
import { renderHook, cleanup } from 'src'

describe('async hook tests', () => {
  const getSomeName = () => Promise.resolve('Betty')

  const useName = (prefix) => {
    const [name, setName] = useState('nobody')

    useEffect(() => {
      getSomeName().then((theName) => {
        setName(prefix ? `${prefix} ${theName}` : theName)
      })
    }, [prefix])

    return name
  }

  afterEach(cleanup)

  test('should wait for next update', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useName())

    expect(result.current).toBe('nobody')

    await waitForNextUpdate()

    expect(result.current).toBe('Betty')
  })

  test('should wait for multiple updates', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(({ prefix }) => useName(prefix), {
      initialProps: { prefix: 'Mrs.' }
    })

    expect(result.current).toBe('nobody')

    await waitForNextUpdate()

    expect(result.current).toBe('Mrs. Betty')

    rerender({ prefix: 'Ms.' })

    await waitForNextUpdate()

    expect(result.current).toBe('Ms. Betty')
  })

  test('should resolve all when updating', async () => {
    const { result, waitForNextUpdate } = renderHook(({ prefix }) => useName(prefix), {
      initialProps: { prefix: 'Mrs.' }
    })

    expect(result.current).toBe('nobody')

    await Promise.all([waitForNextUpdate(), waitForNextUpdate(), waitForNextUpdate()])

    expect(result.current).toBe('Mrs. Betty')
  })
})
