import React, { Suspense } from 'react'
import { create, act } from 'react-test-renderer'

function TestHook({ callback, hookProps, children }) {
  children(callback(hookProps))
  return null
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    this.props.onError(error)
  }

  componentDidUpdate(prevProps) {
    if (this.props != prevProps && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    return !this.state.hasError && this.props.children
  }
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
      <ErrorBoundary onError={setError}>
        <Suspense fallback={<Fallback />}>
          <TestHook callback={callback} hookProps={hookProps.current}>
            {setValue}
          </TestHook>
        </Suspense>
      </ErrorBoundary>
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
    unmount: () => {
      act(() => {
        unmount()
      })
    }
  }
}

function testHook(...args) {
  console.warn(
    '`testHook` has been deprecated and will be removed in a future release.  Please use `renderHook` instead.'
  )
  return renderHook(...args)
}

export { renderHook, act, testHook }
