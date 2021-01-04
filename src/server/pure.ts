import ReactDOMServer from 'react-dom/server'
import ReactDOM from 'react-dom'
import { act as baseAct } from 'react-dom/test-utils'

import { TestHookProps, RendererOptions, ServerRenderer } from '../types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'

import toRender from '../helpers/toRender'

// eslint-disable-next-line import/no-mutable-exports
let act: typeof baseAct

function createServerRenderer<TProps, TResult>(
  testHookProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  { wrapper }: RendererOptions<TProps>
): ServerRenderer<TProps> {
  const container = document.createElement('div')

  const testHook = toRender(testHookProps, wrapper, false)

  let renderProps: TProps | undefined
  let hydrated = false

  function serverAct(callback: () => void | undefined): void
  function serverAct(callback: () => Promise<void | undefined>): Promise<undefined>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function serverAct(callback: any) {
    if (!hydrated) {
      throw new Error('You must hydrate the component before you can act')
    }
    return baseAct(callback)
  }

  act = serverAct

  return {
    render(props) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      renderProps = props
      baseAct(() => {
        const serverOutput = ReactDOMServer.renderToString(testHook(props))
        container.innerHTML = serverOutput
      })
    },
    hydrate() {
      if (hydrated) {
        throw new Error('The component can only be hydrated once')
      } else {
        document.body.appendChild(container)
        baseAct(() => {
          ReactDOM.hydrate(testHook(renderProps), container)
        })
        hydrated = true
      }
    },
    rerender(props) {
      if (!hydrated) {
        throw new Error('You must hydrate the component before you can rerender')
      }
      baseAct(() => {
        ReactDOM.render(testHook(props), container)
      })
    },
    unmount() {
      if (hydrated) {
        baseAct(() => {
          ReactDOM.unmountComponentAtNode(container)
          document.body.removeChild(container)
        })
      }
    },
    act
  }
}

const renderHook = createRenderHook(createServerRenderer)

export { renderHook, act, cleanup, addCleanup, removeCleanup }
