import React, { Suspense } from 'react'
import { act, create, ReactTestRenderer } from 'react-test-renderer'

import { TestHookProps, NativeRendererOptions, NativeRendererReturn } from 'types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from 'core/index'
import TestHook from 'core/testHook'

function createRenderer<TProps, TResult>(
  testHookProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  { wrapper: Wrapper }: NativeRendererOptions<TProps>
): NativeRendererReturn<TProps> {
  let container: ReactTestRenderer

  const toRender = (props?: TProps): JSX.Element => (
    <Wrapper {...(props as TProps)}>
      <TestHook hookProps={props} {...testHookProps} />
    </Wrapper>
  )

  return {
    render(props) {
      act(() => {
        container = create(<Suspense fallback={null}>{toRender(props)}</Suspense>)
      })
    },
    rerender(props) {
      act(() => {
        container.update(<Suspense fallback={null}>{toRender(props)}</Suspense>)
      })
    },
    unmount() {
      act(() => {
        container.unmount()
      })
    },
    act
  }
}

const renderHook = createRenderHook(createRenderer)

export { renderHook, act, cleanup, addCleanup, removeCleanup }
