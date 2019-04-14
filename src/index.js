import React from 'react'
import { create, act } from 'react-test-renderer'

function TestHook({ callback, hookProps, children }) {
  try {
    children(callback(hookProps))
  } catch (e) {
    children(undefined, e)
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

  return {
    result,
    addResolver: (resolver) => {
      resolvers.push(resolver)
    },
    updateResult: (val, err) => {
      value = val
      error = err
      resolvers.splice(0, resolvers.length).forEach((resolve) => resolve())
    }
  }
}

function renderHook(callback, { initialProps, wrapper } = {}) {
  const { result, updateResult, addResolver } = resultContainer()
  const hookProps = { current: initialProps }

  const wrapUiIfNeeded = (innerElement) =>
    wrapper ? React.createElement(wrapper, null, innerElement) : innerElement

  const toRender = () =>
    wrapUiIfNeeded(
      <TestHook callback={callback} hookProps={hookProps.current}>
        {updateResult}
      </TestHook>
    )

  let testRenderer
  act(() => {
    testRenderer = create(toRender())
  })
  const { unmount, update } = testRenderer

  return {
    result,
    waitForNextUpdate: () => new Promise((resolve) => addResolver(resolve)),
    rerender: (newProps = hookProps.current) => {
      hookProps.current = newProps
      act(() => {
        update(toRender())
      })
    },
    unmount
  }
}

function testHook(...args) {
  console.warn(
    '`testHook` has been deprecated and will be removed in a future release.  Please use `renderHook` instead.'
  )
  return renderHook(...args)
}

export { renderHook, act, testHook }
