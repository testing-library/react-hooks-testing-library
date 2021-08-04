import * as ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { createRenderHook } from '../core'
import { createTestHarness } from '../helpers/createTestHarness'
import { RendererOptions, RendererProps } from '../types/react'

function createDomRenderer<TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  { wrapper, customRender }: RendererOptions<TProps, TResult>
) {
  const container = document.createElement('div')
  const testHarness = createTestHarness(rendererProps, wrapper, true, customRender)

  return {
    render(props?: TProps) {
      act(() => {
        ReactDOM.render(testHarness(props), container)
      })
    },
    rerender(props?: TProps) {
      act(() => {
        ReactDOM.render(testHarness(props), container)
      })
    },
    unmount() {
      act(() => {
        ReactDOM.unmountComponentAtNode(container)
      })
    },
    act
  }
}

const renderHook = createRenderHook(createDomRenderer)

export { renderHook, act }

export { cleanup, addCleanup, removeCleanup, suppressErrorOutput } from '../core'

export * from '../types/react'
