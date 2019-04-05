import React, { Suspense } from 'react'
import { render, cleanup, act } from 'react-testing-library'

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

function renderHook(callback, { initialProps, ...options } = {}) {
  const { result, setValue, setError, addResolver } = resultContainer()
  const hookProps = { current: initialProps }

  const toRender = () => (
    <ErrorBoundary onError={setError}>
      <Suspense fallback={<Fallback />}>
        <TestHook callback={callback} hookProps={hookProps.current}>
          {setValue}
        </TestHook>
      </Suspense>
    </ErrorBoundary>
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
