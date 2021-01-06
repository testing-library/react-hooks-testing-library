import ReactDOMServer from 'react-dom/server'
import ReactDOM from 'react-dom'
import { act as baseAct } from 'react-dom/test-utils'

import { RendererProps, ReactRendererOptions } from '../types'

import { createRenderHook, cleanup, addCleanup, removeCleanup } from '../core'
import toRender from '../helpers/toRender'

let serverAct: typeof baseAct

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const act: typeof serverAct = (callback: any) => {
  if (!serverAct) {
    return baseAct(callback)
  }
  return serverAct(callback)
}

function createServerRenderer<TProps, TResult>(
  testHookProps: RendererProps<TProps, TResult>,
  { wrapper }: ReactRendererOptions<TProps>
) {
  const container = document.createElement('div')

  const testHook = toRender(testHookProps, wrapper, false)

  let renderProps: TProps | undefined
  let hydrated = false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serverAct = (callback: any) => {
    if (!hydrated) {
      throw new Error('You must hydrate the component before you can act')
    }
    return baseAct(callback)
  }

  return {
    render(props?: TProps) {
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
    rerender(props?: TProps) {
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
