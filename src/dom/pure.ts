import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { RendererProps } from '../types'
import { RendererOptions } from '../types/react'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'
import { createTestHarness } from '../helpers/createTestHarness'

function createDomRenderer<TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  { wrapper }: RendererOptions<TProps>
) {
  const container = document.createElement('div')

  const testHook = createTestHarness(rendererProps, wrapper)

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

export * from '../types'
export * from '../types/react'
