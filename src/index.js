import React, { Suspense } from 'react'
import { act, create } from 'react-test-renderer'

let cleanupCallbacks = []

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

function renderHook(callback, { initialProps, wrapper } = {}) {
  const { result, setValue, setError, addResolver } = resultContainer()
  const hookProps = { current: initialProps }

  const wrapUiIfNeeded = (innerElement) =>
    wrapper ? React.createElement(wrapper, null, innerElement) : innerElement

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

  function unmountHook() {
    act(() => {
      cleanupCallbacks = cleanupCallbacks.filter((cb) => cb !== unmountHook)
      unmount()
    })
  }

  cleanupCallbacks.push(unmountHook)

  let waitingForNextUpdate = null
  const resolveOnNextUpdate = (resolve) => {
    addResolver((...args) => {
      waitingForNextUpdate = null
      resolve(...args)
    })
  }

  return {
    result,
    waitForNextUpdate: () => {
      waitingForNextUpdate = waitingForNextUpdate || act(() => new Promise(resolveOnNextUpdate))
      return waitingForNextUpdate
    },
    rerender: (newProps = hookProps.current) => {
      hookProps.current = newProps
      act(() => {
        update(toRender())
      })
    },
    unmount: unmountHook
  }
}

async function cleanup() {
  await act(async () => {
    await act(async () => {})
    cleanupCallbacks.forEach((cb) => cb())
    cleanupCallbacks = []
  })
}

if (typeof afterEach === 'function' && !process.env.RHTL_SKIP_AUTO_CLEANUP) {
  afterEach(async () => {
    await cleanup()
  })
}

export { renderHook, cleanup, act }
