import ReactDOM from 'react-dom'
import { act as baseAct } from 'react-dom/test-utils'

import { RendererProps, RendererOptions, Act } from '../types/react'

import { createRenderHook } from '../core'
import { createActWrapper } from '../helpers/act'
import { createTestHarness } from '../helpers/createTestHarness'

const act = createActWrapper(baseAct)

function createDomRenderer<TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  { wrapper }: RendererOptions<TProps>
) {
  const container = document.createElement('div')
  const testHarness = createTestHarness(rendererProps, wrapper)

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

export { cleanup, addCleanup, removeCleanup } from '../core'

export * from '../types/react'
