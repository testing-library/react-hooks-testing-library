import React, { createContext, useContext } from 'react'

describe('useContext tests', () => {
  runForRenderers(['default', 'dom', 'native', 'server/hydrated'], ({ renderHook }) => {
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

    test('should update mutated value in context', () => {
      const TestContext = createContext('foo')

      const value = { current: 'bar' }

      const wrapper: React.FC = ({ children }) => (
        <TestContext.Provider value={value.current}>{children}</TestContext.Provider>
      )

      const { result, rerender } = renderHook(() => useContext(TestContext), { wrapper })

      value.current = 'baz'

      rerender()

      expect(result.current).toBe('baz')
    })

    test('should update value in context when props are updated', () => {
      const TestContext = createContext('foo')

      const wrapper: React.FC<{ current: string }> = ({ current, children }) => (
        <TestContext.Provider value={current}>{children}</TestContext.Provider>
      )

      const { result, rerender } = renderHook(() => useContext(TestContext), {
        wrapper,
        initialProps: {
          current: 'bar'
        }
      })

      rerender({ current: 'baz' })

      expect(result.current).toBe('baz')
    })
  })
})
