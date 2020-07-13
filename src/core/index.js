import asyncUtils from './async-utils'
import { cleanup, addCleanup, removeCleanup } from './cleanup'

function TestHook({ callback, setValue, setError, ...props }) {
  try {
    setValue(callback(props))
  } catch (err) {
    if (err.then) {
      throw err
    } else {
      setError(err)
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

function defaultWrapper({ children }) {
  return children
}

function createRenderHook(createRenderer) {
  return function renderHook(callback, { initialProps, wrapper = defaultWrapper } = {}) {
    const { result, setValue, setError, addResolver } = resultContainer()
    const hookProps = { current: initialProps }
    const props = { callback, setValue, setError }
    const options = { initialProps, wrapper }

    const { render, rerender, unmount, act, ...rendererUtils } = createRenderer(
      TestHook,
      props,
      options
    )

    render(hookProps.current)

    function rerenderHook(newProps = hookProps.current) {
      hookProps.current = newProps
      rerender(hookProps.current)
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
      ...asyncUtils(act, addResolver),
      ...rendererUtils
    }
  }
}

export { createRenderHook, cleanup }
