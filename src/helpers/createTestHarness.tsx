import React, { Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import filterConsole from 'filter-console'

import { addCleanup } from '../core'

import { RendererProps, WrapperComponent } from '../types/react'

function suppressErrorOutput() {
  // The error output from error boundaries is notoriously difficult to suppress.  To save
  // out users from having to work it out, we crudely suppress the output matching the patterns
  // below.  For more information, see these issues:
  //   - https://github.com/testing-library/react-hooks-testing-library/issues/50
  //   - https://github.com/facebook/react/issues/11098#issuecomment-412682721
  //   - https://github.com/facebook/react/issues/15520
  //   - https://github.com/facebook/react/issues/18841
  const removeConsoleFilter = filterConsole(
    [
      /^The above error occurred in the <TestComponent> component:/, // error boundary output
      /^Error: Uncaught .+/ // jsdom output
    ],
    {
      methods: ['error']
    }
  )
  addCleanup(removeConsoleFilter)
}

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

  suppressErrorOutput()

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
