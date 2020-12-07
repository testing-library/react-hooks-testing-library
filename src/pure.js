import React, { Suspense } from 'react'
import { act, create } from 'react-test-renderer'
import asyncUtils from './asyncUtils'
import { cleanup, addCleanup, removeCleanup } from './cleanup'

function TestHook({ callback, hookProps, onError, children }) {
  try {
    children(callback(hookProps))
  } catch (err) {
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

function resultContainer() {
  const results = []
  const resolvers = []

  const result = {
    get all() {
      return results.map(({ value, error }) => error || value)
    },
    get current() {
      const { value, error } = results[results.length - 1]
      if (error) {
        throw error
      }
      return value
    },
    get error() {
      const { error } = results[results.length - 1]
      return error
    }
  }

  const updateResult = (value, error) => {
    results.push({ value, error })
    resolvers.splice(0, resolvers.length).forEach((resolve) => resolve())
  }

  return {
    result,
    addResolver: (resolver) => {
      resolvers.push(resolver)
    },
    setValue: (value) => updateResult(value),
    setError: (error) => updateResult(undefined, error)
  }
}

function renderHook(callback, { initialProps, wrapper } = {}) {
  const { result, setValue, setError, addResolver } = resultContainer()
  const hookProps = { current: initialProps }

  const wrapUiIfNeeded = (innerElement) =>
    wrapper ? React.createElement(wrapper, hookProps.current, innerElement) : innerElement

  const toRender = () =>
    wrapUiIfNeeded(
      <Suspense fallback={<Fallback />}>
        <TestHook callback={callback} hookProps={hookProps.current} onError={setError}>
          {setValue}
        </TestHook>
      </Suspense>
    )

  let testRenderer
  act(() => {
    testRenderer = create(toRender())
  })
  const { unmount, update } = testRenderer

  function rerenderHook(newProps = hookProps.current) {
    hookProps.current = newProps
    act(() => {
      update(toRender())
    })
  }

  function unmountHook() {
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
