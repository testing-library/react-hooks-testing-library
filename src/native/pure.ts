import { act, create, ReactTestRenderer } from 'react-test-renderer'

import { RendererProps } from '../types'
import { RendererOptions } from '../types/react'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'
import { createTestHarness } from '../helpers/createTestHarness'

function createNativeRenderer<TProps, TResult>(
  testHookProps: RendererProps<TProps, TResult>,
  { wrapper }: RendererOptions<TProps>
) {
  let container: ReactTestRenderer

  const testHook = createTestHarness(testHookProps, wrapper)

  return {
    render(props?: TProps) {
      act(() => {
        container = create(testHook(props))
      })
    },
    rerender(props?: TProps) {
      act(() => {
        container.update(testHook(props))
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

export { renderHook, act, cleanup, addCleanup, removeCleanup }

export * from '../types'
export * from '../types/react'
