import React, { Suspense } from 'react'
import TestHook from '../core/testHook'

import { RendererProps, WrapperComponent } from '../types'

// typed this way in relation to this https://github.com/DefinitelyTyped/DefinitelyTyped/issues/44572#issuecomment-625878049
function defaultWrapper({ children }: { children?: React.ReactNode }) {
  return (children as unknown) as JSX.Element
}

const toRender = <TProps, TResult>(
  testHookProps: RendererProps<TProps, TResult>,
  Wrapper: WrapperComponent<TProps> = defaultWrapper,
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
