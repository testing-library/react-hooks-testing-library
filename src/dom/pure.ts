import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { TestHookProps, RendererOptions, Renderer } from '../types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core/index'
import toRender from '../helpers/toRender'

function createDomRenderer<TProps, TResult>(
  testHookProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  { wrapper }: RendererOptions<TProps>
): Renderer<TProps> {
  const container = document.createElement('div')

  const testHook = toRender(testHookProps, wrapper)

  return {
    render(props) {
      document.body.appendChild(container)
      act(() => {
        ReactDOM.render(testHook(props), container)
      })
    },
    rerender(props) {
      act(() => {
        ReactDOM.render(testHook(props), container)
      })
    },
    unmount() {
      act(() => {
        ReactDOM.unmountComponentAtNode(container)
      })
      document.body.removeChild(container)
    },
    act
  }
}

const renderHook = createRenderHook(createDomRenderer)

export { renderHook, act, cleanup, addCleanup, removeCleanup }
