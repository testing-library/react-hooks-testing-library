import { act as baseAct, create, ReactTestRenderer } from 'react-test-renderer'

import { RendererProps, RendererOptions, Act } from '../types/react'

import { createRenderHook } from '../core'
import { createActWrapper } from '../helpers/act'
import { createTestHarness } from '../helpers/createTestHarness'

const act = createActWrapper(baseAct)

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

export { cleanup, addCleanup, removeCleanup } from '../core'

export * from '../types/react'
