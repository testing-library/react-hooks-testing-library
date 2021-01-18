import React, { Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import { RendererProps, WrapperComponent } from '../types/react'

function createTestHarness<TProps, TResult>(
  { callback, setValue, setError }: RendererProps<TProps, TResult>,
  Wrapper?: WrapperComponent<TProps>,
  suspense: boolean = true
) {
  const TestComponent = ({ hookProps }: { hookProps?: TProps }) => {
    // coerce undefined into TProps, so it maintains the previous behaviour
    setValue(callback(hookProps as TProps))
    return null
  }

  let resetErrorBoundary = () => {}
  const ErrorFallback = ({ error, resetErrorBoundary: reset }: FallbackProps) => {
    resetErrorBoundary = () => {
      resetErrorBoundary = () => {}
      reset()
    }
    setError(error)
    return null
  }

  const testHarness = (props?: TProps) => {
    resetErrorBoundary()

    let component = <TestComponent hookProps={props} />
    if (Wrapper) {
      component = <Wrapper {...(props as TProps)}>{component}</Wrapper>
    }
    if (suspense) {
      component = <Suspense fallback={null}>{component}</Suspense>
    }
    return <ErrorBoundary FallbackComponent={ErrorFallback}>{component}</ErrorBoundary>
  }

  return testHarness
}

export { createTestHarness }
