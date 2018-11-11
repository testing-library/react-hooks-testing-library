import { createContext, useContext } from 'react'
import { useHook, cleanup } from 'src'

describe('useContext tests', () => {
  afterEach(cleanup)

  test('should get default value from context', () => {
    const TestContext = createContext('foo')

    const { getCurrentValue } = useHook(() => useContext(TestContext))

    const value = getCurrentValue()

    expect(value).toBe('foo')
  })

  test('should get default value from context provider', () => {
    const TestContext = createContext('foo')

    const { getCurrentValue } = useHook(() => useContext(TestContext))

    const value = getCurrentValue()

    expect(value).toBe('foo')
  })

  test('should get value from context', () => {
    const TestContext = createContext('foo')

    const { getCurrentValue, addContextProvider } = useHook(() => useContext(TestContext))

    addContextProvider(TestContext, { value: 'bar' })

    const value = getCurrentValue()

    expect(value).toBe('bar')
  })

  test('should get value from context provider', () => {
    const TestContext = createContext('foo')

    const { getCurrentValue, addContextProvider } = useHook(() => useContext(TestContext))

    addContextProvider(TestContext.Provider, { value: 'bar' })

    const value = getCurrentValue()

    expect(value).toBe('bar')
  })

  test('should update value in context', () => {
    const TestContext = createContext('foo')

    const { getCurrentValue, addContextProvider } = useHook(() => useContext(TestContext))

    const { updateContext } = addContextProvider(TestContext, { value: 'bar' })

    updateContext({ value: 'baz' })

    const value = getCurrentValue()

    expect(value).toBe('baz')
  })

  test('should update value in context provider', () => {
    const TestContext = createContext('foo')

    const { getCurrentValue, addContextProvider } = useHook(() => useContext(TestContext))

    const { updateContext } = addContextProvider(TestContext.Provider, { value: 'bar' })

    updateContext({ value: 'baz' })

    const value = getCurrentValue()

    expect(value).toBe('baz')
  })
})
