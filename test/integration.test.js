import React, { useState, useContext, createContext, useEffect } from 'react'
import { useHook, cleanup } from 'src'

describe('useHook tests', () => {
  afterEach(cleanup)

  test('should handle useState hooks', () => {
    const { use, update } = useHook(() => useState('foo'))

    const [value1, setValue] = use()

    expect(value1).toBe('foo')

    setValue('bar')

    const [value2] = update()

    expect(value2).toBe('bar')
  })

  test('should handle useContext hooks', () => {
    const TestContext = createContext('foo')

    const { use } = useHook(() => useContext(TestContext)).withContextProvider(
      TestContext.Provider,
      { value: 'bar' }
    )

    const value = use()

    expect(value).toBe('bar')
  })

  test('should handle useEffect hooks', () => {
    const sideEffect = { [1]: false, [2]: false }

    const { use, flushEffects, update } = useHook(({ id }) =>
      useEffect(
        () => {
          sideEffect[id] = true
          return () => {
            sideEffect[id] = false
          }
        },
        [id]
      )
    )

    use({ id: 1 })

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(false)

    flushEffects()

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    update({ id: 2 })

    expect(sideEffect[1]).toBe(true)
    expect(sideEffect[2]).toBe(false)

    flushEffects()

    expect(sideEffect[1]).toBe(false)
    expect(sideEffect[2]).toBe(true)
  })
})
