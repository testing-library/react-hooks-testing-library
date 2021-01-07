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

export const createTestHarness = <TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  Wrapper?: WrapperComponent<TProps>,
  suspense: boolean = true
) => {
  return (props?: TProps) => {
    let component = <TestComponent hookProps={props} {...rendererProps} />
    if (Wrapper) {
      component = <Wrapper {...(props as TProps)}>{component}</Wrapper>
    }
    if (suspense) {
      component = <Suspense fallback={null}>{component}</Suspense>
    }
    return component
  }
}
