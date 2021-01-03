import React, { Suspense } from 'react'
import TestHook from '../core/testHook'

import { TestHookProps, WrapperComponent } from '../types'

const toRender = <TProps, TResult>(
  testHookProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  Wrapper: WrapperComponent<TProps>,
  suspense: boolean = true
) => {
  return function RenderWrapper(props?: TProps) {
    if (suspense) {
      return (
        <Suspense fallback={null}>
          <Wrapper {...(props as TProps)}>
            <TestHook hookProps={props} {...testHookProps} />
          </Wrapper>
        </Suspense>
      )
    } else {
      return (
        <Wrapper {...(props as TProps)}>
          <TestHook hookProps={props} {...testHookProps} />
        </Wrapper>
      )
    }
  }
}

export default toRender
