import React, { Suspense } from 'react'

import { RendererProps } from '../types'
import { WrapperComponent } from '../types/react'

import { isPromise } from './promises'

function TestComponent<TProps, TResult>({
  hookProps,
  callback,
  setError,
  setValue
}: RendererProps<TProps, TResult> & { hookProps?: TProps }) {
  try {
    // coerce undefined into TProps, so it maintains the previous behaviour
    setValue(callback(hookProps as TProps))
  } catch (err: unknown) {
    if (isPromise(err)) {
      throw err
    } else {
      setError(err as Error)
    }
  }
  return null
}

function createTestHarness<TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  Wrapper?: WrapperComponent<TProps>,
  suspense: boolean = true
) {
  const testHarness = (props?: TProps) => {
    let component = <TestComponent hookProps={props} {...rendererProps} />
    if (Wrapper) {
      component = <Wrapper {...(props as TProps)}>{component}</Wrapper>
    }
    if (suspense) {
      component = <Suspense fallback={null}>{component}</Suspense>
    }
    return component
  }

  // If the function name does not get used before it is returned,
  // it seems to vanish in nodejs and does not appear in stack traces.
  // This dummy usage works around that.
  const _name = testHarness.name // eslint-disable-line @typescript-eslint/no-unused-vars

  return testHarness
}

export { createTestHarness }
