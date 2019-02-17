import React from 'react'
import { createContext, useContext } from 'react'
import { testHook, cleanup } from 'src'

describe('useContext tests', () => {
  afterEach(cleanup)

  test('should get default value from context', () => {
    const TestContext = createContext('foo')

    const { result } = testHook(() => useContext(TestContext))

    const value = result.current

    expect(value).toBe('foo')
  })

  test('should get default value from context provider', () => {
    const TestContext = createContext('foo')

    const { result } = testHook(() => useContext(TestContext))

    const value = result.current

    expect(value).toBe('foo')
  })

  test('should get value from context', () => {
    const TestContext = createContext('foo')

    const wrapper = ({ children }) => (
      <TestContext.Provider value="bar">{children}</TestContext.Provider>
    )

    const { result } = testHook(() => useContext(TestContext), { wrapper })

    const value = result.current

    expect(value).toBe('bar')
  })

  test('should get value from context provider', () => {
    const TestContext = createContext('foo')

    const wrapper = ({ children }) => (
      <TestContext.Provider value="bar">{children}</TestContext.Provider>
    )

    const { result } = testHook(() => useContext(TestContext), { wrapper })

    expect(result.current).toBe('bar')
  })

  test('should update value in context', () => {
    const TestContext = createContext('foo')

    const value = { current: 'bar' }

    const wrapper = ({ children }) => (
      <TestContext.Provider value={value.current}>{children}</TestContext.Provider>
    )

    const { result, rerender } = testHook(() => useContext(TestContext), { wrapper })

    value.current = 'baz'

    rerender()

    expect(result.current).toBe('baz')
  })
})
