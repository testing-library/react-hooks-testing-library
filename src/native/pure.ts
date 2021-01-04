import { act, create, ReactTestRenderer } from 'react-test-renderer'

import { TestHookProps, RendererOptions, Renderer } from '../types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core/index'
import toRender from '../helpers/toRender'

function createNativeRenderer<TProps, TResult>(
  testHookProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  { wrapper }: RendererOptions<TProps>
): Renderer<TProps> {
  let container: ReactTestRenderer

  const testHook = toRender(testHookProps, wrapper)

  return {
    render(props) {
      act(() => {
        container = create(testHook(props))
      })
    },
    rerender(props) {
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
