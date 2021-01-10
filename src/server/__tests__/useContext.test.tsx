import React, { createContext, useContext } from 'react'
import { renderHook } from '..'

describe('useContext tests', () => {
  test('should get default value from context', () => {
    const TestContext = createContext('foo')

    const { result } = renderHook(() => useContext(TestContext))

    const value = result.current

    expect(value).toBe('foo')
  })

  test('should get value from context provider', () => {
    const TestContext = createContext('foo')

    const wrapper: React.FC = ({ children }) => (
      <TestContext.Provider value="bar">{children}</TestContext.Provider>
    )

    const { result } = renderHook(() => useContext(TestContext), { wrapper })

    expect(result.current).toBe('bar')
  })

  test('should update value in context when props are updated', () => {
    const TestContext = createContext('foo')

    const wrapper: React.FC<{ contextValue: string }> = ({ contextValue, children }) => (
      <TestContext.Provider value={contextValue}>{children}</TestContext.Provider>
    )

    const { result, hydrate, rerender } = renderHook(() => useContext(TestContext), {
      wrapper,
      initialProps: { contextValue: 'bar' }
    })

    hydrate()

    rerender({ contextValue: 'baz' })

    expect(result.current).toBe('baz')
  })
})
