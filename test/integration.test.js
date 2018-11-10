import React, { useState, useContext, createContext, useEffect } from 'react'
import { useHook, cleanup } from 'src'

describe('useHook tests', () => {
  afterEach(cleanup)

  test('should handle useState hooks', () => {
    const { render, update } = useHook(() => useState('foo'))

    const [value1, setValue] = render()

    expect(value1).toBe('foo')

    setValue('bar')

    const [value2] = update()

    expect(value2).toBe('bar')
  })

  test('should handle useContext hooks', () => {
    const TestContext = createContext('foo')

    const { render } = useHook(() => useContext(TestContext)).wrap(({ children }) => (
      <TestContext.Provider value='bar'>
        {children}
      </TestContext.Provider>
    ))

    const value = render()

    expect(value).toBe('bar')
  })

  test('should handle useEffect hooks', () => {

    const sideEffect = { [1]: false, [2]: false }
    
    const { render, flushEffects, update } = useHook(({ id }) => useEffect(() => {
      sideEffect[id] = true
      return () => {
        sideEffect[id] = false
      }
    }, [id]))

    render({ id: 1 })

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
