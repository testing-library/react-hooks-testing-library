import { act, create, ReactTestRenderer } from 'react-test-renderer'

import { RendererProps, RendererOptions } from '../types/react'

import { createRenderHook } from '../core'
import { createTestHarness } from '../helpers/createTestHarness'

function createNativeRenderer<TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  { wrapper }: RendererOptions<TProps>
) {
  let container: ReactTestRenderer
  const testHarness = createTestHarness(rendererProps, wrapper)

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
