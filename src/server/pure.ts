import ReactDOMServer from 'react-dom/server'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { RendererProps, RendererOptions } from '../types/react'

import { createRenderHook } from '../core'
import { createTestHarness } from '../helpers/createTestHarness'

function createServerRenderer<TProps, TResult>(
  rendererProps: RendererProps<TProps, TResult>,
  { wrapper }: RendererOptions<TProps>
) {
  let renderProps: TProps | undefined
  let hydrated = false
  const container = document.createElement('div')
  const testHarness = createTestHarness(rendererProps, wrapper, false)

  return {
    render(props?: TProps) {
      renderProps = props
      act(() => {
        try {
          const serverOutput = ReactDOMServer.renderToString(testHarness(props))
          container.innerHTML = serverOutput
        } catch (e: unknown) {
          rendererProps.setError(e as Error)
        }
      })
    },
    hydrate() {
      if (hydrated) {
        throw new Error('The component can only be hydrated once')
      } else {
        act(() => {
          ReactDOM.hydrate(testHarness(renderProps), container)
        })
        hydrated = true
      }
    },
    rerender(props?: TProps) {
      if (!hydrated) {
        throw new Error('You must hydrate the component before you can rerender')
      }
      act(() => {
        ReactDOM.render(testHarness(props), container)
      })
    },
    unmount() {
      if (hydrated) {
        act(() => {
          ReactDOM.unmountComponentAtNode(container)
        })
      }
    },
    act
  }
}

const renderHook = createRenderHook(createServerRenderer)

export { renderHook, act }

export { cleanup, addCleanup, removeCleanup } from '../core'

export * from '../types/react'
