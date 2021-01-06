import { act, create, ReactTestRenderer } from 'react-test-renderer'

import { RendererProps, ReactRendererOptions } from '../types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'
import toRender from '../helpers/toRender'

function createNativeRenderer<TProps, TResult>(
  testHookProps: RendererProps<TProps, TResult>,
  { wrapper }: ReactRendererOptions<TProps>
) {
  let container: ReactTestRenderer

  const testHook = toRender(testHookProps, wrapper)

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
