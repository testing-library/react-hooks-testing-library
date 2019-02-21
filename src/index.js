import React from 'react'
import { render, cleanup, act } from 'react-testing-library'

function TestHook({ callback, hookProps, children }) {
  children(callback(hookProps))
  return null
}

function renderHook(callback, options = {}) {
  const result = { current: null }
  const hookProps = { current: options.initialProps }

  const toRender = () => {
    const hookRender = (
      <TestHook callback={callback} hookProps={hookProps.current}>
        {(res) => {
          result.current = res
        }}
      </TestHook>
    )

    return options.wrapper ? React.createElement(options.wrapper, null, hookRender) : hookRender
  }

  const { unmount, rerender: rerenderComponent } = render(toRender())

  return {
    result,
    unmount,
    rerender: (newProps = hookProps.current) => {
      hookProps.current = newProps
      rerenderComponent(toRender())
    }
  }
}

function testHook(...args) {
  console.warn(
    '`testHook` has been deprecated and will be removed in a future release.  Please use `renderHook` instead.'
  )
  return renderHook(...args)
}

export { renderHook, cleanup, act, testHook }
