import React from 'react'
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

function resultContainer() {
  let value = null
  let error = null
  const resolvers = []

  const result = {
    get current() {
      if (error) {
        throw error
      }
      return value
    },
    get error() {
      return error
    }
  }

  const updateResult = (val, err) => {
    value = val
    error = err
    resolvers.splice(0, resolvers.length).forEach((resolve) => resolve())
  }

  return {
    result,
    addResolver: (resolver) => {
      resolvers.push(resolver)
    },
    setValue: (val) => updateResult(val),
    setError: (err) => updateResult(undefined, err)
  }
}

function createRenderHook(createRenderer) {
  return function renderHook(callback, { initialProps, wrapper } = {}) {
    const { result, setValue, setError, addResolver } = resultContainer()
    const hookProps = { current: initialProps }

    const wrapUiIfNeeded = (innerElement) =>
      wrapper ? React.createElement(wrapper, hookProps.current, innerElement) : innerElement

    const toRender = () =>
      wrapUiIfNeeded(
        <TestHook callback={callback} hookProps={hookProps.current} onError={setError}>
          {setValue}
        </TestHook>
      )

    let { render, rerender, unmount, act } = createRenderer()

    render(toRender())

    function rerenderHook(newProps = hookProps.current) {
      hookProps.current = newProps
      rerender(toRender())
    }

    function unmountHook() {
      removeCleanup(unmountHook)
      unmount()
    }

    addCleanup(unmountHook)

    return {
      result,
      rerender: rerenderHook,
      unmount: unmountHook,
      ...asyncUtils(act, addResolver)
    }
  }
}

export { createRenderHook, cleanup }
