import React from 'react'
import ReactDOMServer from 'react-dom/server'
import ReactDOM from 'react-dom'
import { act as baseAct } from 'react-dom/test-utils'

import {
  TestHookProps,
  ServerRendererOptions,
  ServerRendererReturn,
  ServerActCallback,
  ServerActCallbackAsync,
  ServerModifiedAct
} from 'types'

import { createRenderHook, cleanup } from 'core/index'
import TestHook from 'core/testHook'

// eslint-disable-next-line import/no-mutable-exports
let act: ServerModifiedAct

function createServerRenderer<TProps, TResult>(
  testHookProps: Omit<TestHookProps<TProps, TResult>, 'hookProps'>,
  { wrapper: Wrapper }: ServerRendererOptions<TProps>
): ServerRendererReturn<TProps> {
  const container = document.createElement('div')

  const toRender = (props?: TProps): JSX.Element => (
    <Wrapper {...(props as TProps)}>
      <TestHook hookProps={props} {...testHookProps} />
    </Wrapper>
  )

  let renderProps: TProps | undefined
  let hydrated = false

  act = (cb: ServerActCallbackAsync | ServerActCallback) => {
    if (!hydrated) {
      throw new Error('You must hydrate the component before you can act')
    }

    return baseAct(cb as ServerActCallback)
  }

  return {
    render(props) {
      renderProps = props
      baseAct(() => {
        const serverOutput = ReactDOMServer.renderToString(toRender(props))
        container.innerHTML = serverOutput
      })
    },
    hydrate() {
      if (hydrated) {
        throw new Error('The component can only be hydrated once')
      } else {
        document.body.appendChild(container)
        baseAct(() => {
          ReactDOM.hydrate(toRender(renderProps), container)
        })
        hydrated = true
      }
    },
    rerender(props) {
      if (!hydrated) {
        throw new Error('You must hydrate the component before you can rerender')
      }
      baseAct(() => {
        ReactDOM.render(toRender(props), container)
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

export { renderHook, act, cleanup }
