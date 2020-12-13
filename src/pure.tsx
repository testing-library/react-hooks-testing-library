import React, { ReactElement, ReactNode, Suspense } from 'react'
import { act, create, ReactTestRenderer } from 'react-test-renderer'
import asyncUtils from './asyncUtils'
import { cleanup, addCleanup, removeCleanup } from './cleanup'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props<T = any, R = any> = {
  callback: (props: T) => R
  hookProps: unknown
  onError: CallableFunction
  children: CallableFunction
}
function TestHook({ callback, hookProps, onError, children }: Props) {
  try {
    children(callback(hookProps))
    // eslint-disable-next-line @typescript-eslint/no-implicit-any-catch
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.then) {
      throw err
    } else {
      onError(err)
    }
  }
  return null
}

function Fallback() {
  return null
}

function resultContainer<R>() {
  const results: Array<{ value?: R; error?: Error }> = []
  const resolvers: Array<VoidFunction> = []

  const result = {
    get all() {
      return results.map(({ value, error }) => error ?? value)
    },
    get current() {
      const { value, error } = results[results.length - 1]
      if (error) {
        throw error
      }
      return value as R
    },
    get error() {
      const { error } = results[results.length - 1]
      return error
    }
  }

  const updateResult = (value?: R, error?: Error) => {
    results.push({ value, error })
    resolvers.splice(0, resolvers.length).forEach((resolve) => resolve())
  }

  return {
    result,
    addResolver: (resolver: VoidFunction) => {
      resolvers.push(resolver)
    },
    setValue: (value: R) => updateResult(value),
    setError: (error: Error) => updateResult(undefined, error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderHook<T = any, R = any>(
  callback: (props: T) => R,
  { initialProps, wrapper }: { initialProps?: T; wrapper?: React.ComponentType<T> } = {}
) {
  const { result, setValue, setError, addResolver } = resultContainer<R>()
  const hookProps = { current: initialProps }

  const wrapUiIfNeeded = (innerElement: ReactNode) =>
    wrapper ? React.createElement(wrapper, hookProps.current, innerElement) : innerElement

  const toRender = () =>
    wrapUiIfNeeded(
      <Suspense fallback={<Fallback />}>
        <TestHook callback={callback} hookProps={hookProps.current} onError={setError}>
          {setValue}
        </TestHook>
      </Suspense>
    ) as ReactElement

  // eslint-disable-next-line no-undef-init
  let testRenderer: ReactTestRenderer | undefined
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  act(() => {
    testRenderer = create(toRender())
  })
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { unmount, update } = testRenderer as ReactTestRenderer

  function rerenderHook(newProps = hookProps.current) {
    hookProps.current = newProps
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      update(toRender())
    })
  }

  function unmountHook() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      removeCleanup(unmountHook)
      unmount()
    })
  }

  addCleanup(unmountHook)

  return {
    result,
    rerender: rerenderHook,
    unmount: unmountHook,
    ...asyncUtils(addResolver)
  }
}

export { renderHook, cleanup, addCleanup, removeCleanup, act }
