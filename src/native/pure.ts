import { act, create, ReactTestRenderer } from 'react-test-renderer'

import { createRenderHook } from '../core'
import { createTestHarness } from '../helpers/createTestHarness'
import { RendererOptions, RendererProps } from '../types/react'

function createNativeRenderer<TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  { wrapper, customRender }: RendererOptions<TProps, TResult>
) {
  let container: ReactTestRenderer
  const testHarness = createTestHarness(rendererProps, wrapper, true, customRender)

  return {
    render(props?: TProps) {
      act(() => {
        container = create(testHarness(props))
      })
    },
    rerender(props?: TProps) {
      act(() => {
        container.update(testHarness(props))
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

const renderHook = createRenderHook(createNativeRenderer)

export { renderHook, act }

export { cleanup, addCleanup, removeCleanup, suppressErrorOutput } from '../core'

export * from '../types/react'
