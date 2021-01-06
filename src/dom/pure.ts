import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { RendererProps } from 'types'
import { ReactRendererOptions } from '../react/types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'
import { createTestHarness } from '../react/createTestHarness'

function createDomRenderer<TProps, TResult>(
  testHookProps: RendererProps<TProps, TResult>,
  { wrapper }: ReactRendererOptions<TProps>
) {
  const container = document.createElement('div')

  const testHook = createTestHarness(testHookProps, wrapper)

  return {
    render(props?: TProps) {
      document.body.appendChild(container)
      act(() => {
        ReactDOM.render(testHook(props), container)
      })
    },
    rerender(props?: TProps) {
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
