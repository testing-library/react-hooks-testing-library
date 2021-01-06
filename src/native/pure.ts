import { act, create, ReactTestRenderer } from 'react-test-renderer'

import { RendererProps } from 'types'
import { ReactRendererOptions } from '../react/types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'
import { createTestHarness } from '../react/createTestHarness'

function createNativeRenderer<TProps, TResult>(
  testHookProps: RendererProps<TProps, TResult>,
  { wrapper }: ReactRendererOptions<TProps>
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
