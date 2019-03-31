import React from 'react'
import { render, cleanup, act } from 'react-testing-library'

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

function renderHook(callback, { initialProps, ...options } = {}) {
  const { result, updateResult, addResolver } = resultContainer()
  const hookProps = { current: initialProps }

  const toRender = () => (
    <TestHook callback={callback} hookProps={hookProps.current}>
      {updateResult}
    </TestHook>
  )

  const { unmount, rerender: rerenderComponent } = render(toRender(), options)

  return {
    result,
    waitForNextUpdate: () => new Promise((resolve) => addResolver(resolve)),
    rerender: (newProps = hookProps.current) => {
      hookProps.current = newProps
      rerenderComponent(toRender())
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

export { renderHook, cleanup, act, testHook }
